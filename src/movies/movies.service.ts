import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class MoviesService {
  constructor(private readonly httpService: HttpService) {}

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

    const movie = findMovieByName.data.results.find((movie) => movie.title === name);
    if (!movie) {
      throw new BadRequestException('Movie name not found');
    }

    await this.addFavorite(accountId, sessionId, movie.id.toString());
  }

  findAll() {
    return `This action returns all movies`;
  }

  findOne(id: number) {
    return `This action returns a #${id} movie`;
  }

  update(id: number, updateMovieDto: UpdateMovieDto) {
    return `This action updates a #${id} movie`;
  }

  async addFavorite(accountId: number, sessionId: string, movieId: string): Promise<void> {
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
