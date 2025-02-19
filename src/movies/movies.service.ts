import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { HttpService } from '@nestjs/axios';
import { Movie } from './entities/movie.entity';
import { MovieDto } from './dto/movie.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginatedListDto } from './dto/paginated-list.dto';
import { EStatusMovie } from './status-movie.enum';
import { RateMovieDto } from './dto/rate-movie.dto';
import { UpdateStatusMovieDto } from './dto/update-movie.dto';
import { Logger } from 'src/loggers/entities/logger.entity';
import { LoggerService } from 'src/loggers/logger.service';

@Injectable()
export class MoviesService {
  constructor(
    private readonly httpService: HttpService,

    @InjectRepository(Movie)
    private readonly repository: Repository<Movie>,

    private readonly loggerService: LoggerService,
  ) {}

  async create({ name }: CreateMovieDto): Promise<Movie> {
    try {
      const TOKEN_API = process.env.TOKEN_API;
      if (!TOKEN_API) throw new InternalServerErrorException('TOKEN_API not found');

      const findMovieByName = await this.httpService.axiosRef.get(
        `https://api.themoviedb.org/3/search/movie?query=${name}`,
        {
          headers: {
            Authorization: `Bearer ${TOKEN_API}`,
            accept: 'application/json',
          },
        },
      );

      if (findMovieByName.data.results.length === 0) {
        throw new BadRequestException('Movie name not found');
      }

      const movie: MovieDto = findMovieByName.data.results.find((movie) => movie.title === name);

      if (!movie) {
        throw new BadRequestException('Movie name not found');
      }

      const {
        adult,
        backdrop_path,
        id,
        original_language,
        original_title,
        overview,
        popularity,
        poster_path,
        release_date,
        title,
      } = movie;

      const movieExists = await this.repository.findOne({ where: { originalTitle: original_title } });
      if (movieExists) throw new BadRequestException('Movie already exists in favorite list');

      const movieEntity = new Movie(
        adult,
        backdrop_path,
        id,
        original_language,
        original_title,
        overview,
        popularity,
        poster_path,
        release_date,
        title,
      );

      return await this.repository.save(movieEntity);
    } catch (error) {
      if (error instanceof BadRequestException) throw error;

      throw new InternalServerErrorException('Internal server error to create movie');
    }
  }

  async findAll(page: number, limit: number, status?: EStatusMovie): Promise<PaginatedListDto<Movie[]>> {
    try {
      const [movies, total] = await this.repository.findAndCount({
        where: status ? { status } : {},
        take: limit,
        skip: (page - 1) * limit,
      });

      return {
        data: movies,
        total,
        page,
        lastPage: Math.ceil(total / limit),
      };
    } catch {
      throw new InternalServerErrorException('Internal server error finding movies');
    }
  }

  async findOne(id: string): Promise<Movie> {
    try {
      const movie = await this.repository.findOneBy({ id });
      if (!movie) throw new NotFoundException('MovieId does not exists');

      return movie;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      throw new InternalServerErrorException('Error finding movie');
    }
  }

  async updateStateMovieDatabase(id: string, { statusMovie }: UpdateStatusMovieDto): Promise<void> {
    try {
      const movie = await this.repository.findOneBy({ id });
      if (!movie) throw new NotFoundException('MovieId does not exists');

      if (statusMovie === EStatusMovie.AVALIADO && movie.status !== EStatusMovie.ASSISTIDO)
        throw new BadRequestException('The movie status can only be changed if the movie is watched');

      if (
        movie.status !== EStatusMovie.AVALIADO &&
        (statusMovie === EStatusMovie.RECOMENDADO || statusMovie === EStatusMovie.NAO_RECOMENDADO)
      )
        throw new BadRequestException(
          'The movie must be "Recommended" or "Not Recommended" before it can be "Rated".',
        );

      movie.setStatus(statusMovie);
      await this.repository.update({ id }, movie);
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) throw error;

      throw new InternalServerErrorException('Error to update status movie');
    }
  }

  async rateMovie(id: string, { rate }: RateMovieDto): Promise<void> {
    try {
      const movie = await this.repository.findOneBy({ id });
      if (!movie) {
        throw new NotFoundException('MovieId does not exists');
      }

      if (movie.status === EStatusMovie.ASSISTIR)
        throw new BadRequestException('the movie status can only be changed if the movie is watched');

      if (movie.status === EStatusMovie.NAO_RECOMENDADO || movie.status === EStatusMovie.RECOMENDADO)
        throw new BadRequestException('the movie was already rated');

      movie.setRate(rate);
      movie.setStatus(EStatusMovie.AVALIADO);
      await this.repository.update({ id }, movie);
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) throw error;

      throw new InternalServerErrorException('Error to rate movie');
    }
  }

  async getMovieHistory(page: number, limit: number, id: string): Promise<PaginatedListDto<Logger[]>> {
    try {
      const movie = await this.repository.findOneBy({ id });
      if (!movie) {
        throw new NotFoundException('MovieId does not exists');
      }

      return await this.loggerService.findHistoryMovie(page, limit, id);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      throw new InternalServerErrorException('Error finding movie history');
    }
  }
}
