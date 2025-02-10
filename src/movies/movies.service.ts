import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { HttpService } from '@nestjs/axios';
import { Movie } from './entities/movie.entity';
import { MovieDto } from './dto/movie.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginatedListDto } from './dto/paginated-list.dto';

@Injectable()
export class MoviesService {
  constructor(
    private readonly httpService: HttpService,

    @InjectRepository(Movie)
    private readonly repository: Repository<Movie>,
  ) {}

  async create({ name }: CreateMovieDto, accountId: number, sessionId: string): Promise<void> {
    const findMovieByName = await this.httpService.axiosRef.get(
      `https://api.themoviedb.org/3/search/movie?query=${name}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.TOKEN_API}`,
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
      vote_average,
      vote_count,
    } = movie;

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
      vote_average,
      vote_count,
    );

    await this.addFavoriteListAPI(accountId, sessionId, movie.id.toString());
    await this.repository.save(movieEntity);
  }

  async findAllDatabase(page: number, limit: number): Promise<PaginatedListDto<Movie[]>> {
    const [movies, total] = await this.repository.findAndCount({
      take: limit,
      skip: (page - 1) * limit,
    });

    return {
      data: movies,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }

  async findAllApi(accountId: number, sessionId: string): Promise<PaginatedListDto<any[]>> {
    try {
      const response = await this.httpService.axiosRef.get(
        `https://api.themoviedb.org/3/account/${accountId}/favorite/movies`,
        {
          params: {
            api_key: process.env.API_KEY,
            session_id: sessionId,
          },
        },
      );

      return {
        data: response.data.results,
        total: response.data.total_results,
        page: response.data.page,
        lastPage: response.data.total_pages,
      };
    } catch (error) {
      throw new InternalServerErrorException('Erro ao listar filmes favoritos', error);
    }
  }

  async findOneDatabase(id: string): Promise<Movie> {
    try {
      const movie = await this.repository.findOneBy({ id });
      if (!movie) {
        throw new BadRequestException('MovieId does not exists');
      }

      return movie;
    } catch (error) {
      if (error instanceof BadRequestException) throw error;

      throw new InternalServerErrorException('Error finding movie');
    }
  }

  async findOneApi(id: number): Promise<any> {
    try {
      const response = await this.httpService.axiosRef.get(`https://api.themoviedb.org/3/movie/${id}`, {
        headers: {
          Authorization: `Bearer ${process.env.TOKEN_API}`,
          accept: 'application/json',
        },
      });

      return response.data;
    } catch (error) {
      if (error instanceof BadRequestException) throw error;

      throw new InternalServerErrorException('Error finding movie');
    }
  }

  update(id: number, updateMovieDto: UpdateMovieDto) {
    return `This action updates a #${id} movie`;
  }

  async addFavoriteListAPI(accountId: number, sessionId: string, movieId: string): Promise<void> {
    try {
      await this.httpService.axiosRef.post(
        `https://api.themoviedb.org/3/account/${accountId}/favorite`,
        {
          media_type: 'movie',
          media_id: movieId,
          favorite: true,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.TOKEN_API}`,
            accept: 'application/json',
          },
          params: {
            api_key: process.env.API_KEY,
            session_id: sessionId,
          },
        },
      );
    } catch (error) {
      throw new InternalServerErrorException('Error to add movie to favorites', error);
    }
  }
}
