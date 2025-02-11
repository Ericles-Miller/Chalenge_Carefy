import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { Movie } from './entities/movie.entity';
import { CreateMovieDto } from './dto/create-movie.dto';
import { MovieDto } from './dto/movie.dto';
import { LoggerService } from 'src/loggers/logger.service';
import { Logger } from 'nestjs-pino';
import { EStatusMovie } from './status-movie.enum';
import { PaginatedListDto } from './dto/paginated-list.dto';
import { RateMovieDto } from './dto/rate-movie.dto';
import * as dotenv from 'dotenv';

dotenv.config();

describe('MoviesService', () => {
  let service: MoviesService;
  let httpService: HttpService;
  let repository: Repository<Movie>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesService,
        LoggerService,
        {
          provide: HttpService,
          useValue: {
            axiosRef: {
              get: jest.fn(),
            },
          },
        },
        {
          provide: getRepositoryToken(Movie),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Logger),
          useClass: Repository<Logger>,
        },
      ],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
    httpService = module.get<HttpService>(HttpService);
    repository = module.get<Repository<Movie>>(getRepositoryToken(Movie));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a movie successfully', async () => {
      const createMovieDto: CreateMovieDto = { name: 'The Batman' };

      const movieFromApi: MovieDto = {
        adult: false,
        backdrop_path: '/path',
        id: 123,
        original_language: 'en',
        original_title: 'The Batman',
        overview: 'Overview text',
        popularity: 10,
        poster_path: '/poster.jpg',
        release_date: new Date(),
        title: 'The Batman',
      };

      jest.spyOn(httpService.axiosRef, 'get').mockResolvedValueOnce({
        data: {
          results: [movieFromApi],
        },
      });

      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(null);

      jest
        .spyOn(repository, 'save')
        .mockResolvedValueOnce(
          new Movie(
            movieFromApi.adult,
            movieFromApi.backdrop_path,
            movieFromApi.id,
            movieFromApi.original_language,
            movieFromApi.original_title,
            movieFromApi.overview,
            movieFromApi.popularity,
            movieFromApi.poster_path,
            movieFromApi.release_date,
            movieFromApi.title,
          ),
        );

      const result = await service.create(createMovieDto);
      expect(result).toBeInstanceOf(Movie);
      expect(result.title).toBe('The Batman');
      expect(repository.save).toHaveBeenCalled();
    });

    it('should throw BadRequestException if movie name not found', async () => {
      const createMovieDto: CreateMovieDto = { name: 'Nonexistent Movie' };

      jest.spyOn(httpService.axiosRef, 'get').mockResolvedValueOnce({
        data: {
          results: [],
        },
      });

      await expect(service.create(createMovieDto)).rejects.toThrow(
        new BadRequestException('Movie name not found'),
      );
    });

    it('should throw BadRequestException if movie already exists in favorite list', async () => {
      const createMovieDto: CreateMovieDto = { name: 'The Batman' };

      const movieFromApi: MovieDto = {
        adult: false,
        backdrop_path: '/path',
        id: 123,
        original_language: 'en',
        original_title: 'The Batman',
        overview: 'Overview text',
        popularity: 10,
        poster_path: '/poster.jpg',
        release_date: new Date(),
        title: 'The Batman',
      };

      jest.spyOn(httpService.axiosRef, 'get').mockResolvedValueOnce({
        data: {
          results: [movieFromApi],
        },
      });

      jest
        .spyOn(repository, 'findOne')
        .mockResolvedValueOnce(
          new Movie(
            movieFromApi.adult,
            movieFromApi.backdrop_path,
            movieFromApi.id,
            movieFromApi.original_language,
            movieFromApi.original_title,
            movieFromApi.overview,
            movieFromApi.popularity,
            movieFromApi.poster_path,
            movieFromApi.release_date,
            movieFromApi.title,
          ),
        );

      await expect(service.create(createMovieDto)).rejects.toThrow(
        new BadRequestException('Movie already exists in favorite list'),
      );
    });

    it('should throw InternalServerErrorException if an unexpected error occurs', async () => {
      const createMovieDto: CreateMovieDto = { name: 'The Batman' };

      jest.spyOn(httpService.axiosRef, 'get').mockRejectedValueOnce(new Error('Something went wrong'));

      await expect(service.create(createMovieDto)).rejects.toThrow(
        new InternalServerErrorException('Internal server error to create movie'),
      );
    });
  });

  describe('findAll', () => {
    it('should return paginated list of movies', async () => {
      const page = 1;
      const limit = 10;
      const status = EStatusMovie.ASSISTIR;

      const movies = [
        new Movie(
          false,
          '/bCDn6Bzfjjiov7Reu5MVZIhVQJm.jpg',
          1,
          'en',
          'Movie 1',
          'overview',
          5,
          'path',
          new Date(),
          'Movie 1',
        ),
        new Movie(
          true,
          '/bCDn6Bzfjjiov7Reu5MVZIhVQJm.jpg',
          2,
          'en',
          'Movie 2',
          'overview',
          6,
          'path',
          new Date(),
          'Movie 2',
        ),
      ];

      const total = 2;

      jest.spyOn(repository, 'findAndCount').mockResolvedValueOnce([movies, total]);

      const result: PaginatedListDto<Movie[]> = await service.findAll(page, limit, status);

      expect(result).toEqual({
        data: movies,
        total,
        page,
        lastPage: 1,
      });
      expect(repository.findAndCount).toHaveBeenCalledWith({
        where: { status },
        take: limit,
        skip: (page - 1) * limit,
      });
    });

    it('should return empty list when no movies are found', async () => {
      const page = 1;
      const limit = 10;
      const status = EStatusMovie.NAO_RECOMENDADO;

      const movies: Movie[] = [];
      const total = 0;

      jest.spyOn(repository, 'findAndCount').mockResolvedValueOnce([movies, total]);

      const result: PaginatedListDto<Movie[]> = await service.findAll(page, limit, status);

      expect(result).toEqual({
        data: [],
        total,
        page,
        lastPage: 0,
      });
      expect(repository.findAndCount).toHaveBeenCalledWith({
        where: { status },
        take: limit,
        skip: (page - 1) * limit,
      });
    });

    it('should throw BadRequestException if an unexpected error occurs', async () => {
      const page = 1;
      const limit = 10;

      jest.spyOn(repository, 'findAndCount').mockRejectedValue(new Error('Something went wrong'));

      await expect(service.findAll(page, limit)).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('findOne', () => {
    it('should return a movie when movie is found', async () => {
      const movieId = '1';
      const movie = new Movie(
        true,
        'path1',
        1,
        'en',
        'Movie 1',
        'overview',
        5,
        'path',
        new Date(),
        'Movie 1',
      );

      jest.spyOn(repository, 'findOneBy').mockResolvedValueOnce(movie);

      const result: Movie = await service.findOne(movieId);

      expect(result).toEqual(movie);
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: movieId });
    });

    it('should throw NotFoundException if movie is not found', async () => {
      const movieId = '1';

      jest.spyOn(repository, 'findOneBy').mockResolvedValueOnce(null);

      await expect(service.findOne(movieId)).rejects.toThrow(
        new NotFoundException('MovieId does not exists'),
      );
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: movieId });
    });

    it('should throw InternalServerErrorException on unexpected errors', async () => {
      const movieId = '1';

      jest.spyOn(repository, 'findOneBy').mockRejectedValueOnce(new Error('Unexpected error'));

      await expect(service.findOne(movieId)).rejects.toThrow(
        new InternalServerErrorException('Error finding movie'),
      );
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: movieId });
    });
  });

  describe('rateMovie', () => {
    it('should successfully rate a movie when movie status allows', async () => {
      const movieId = '1';
      const rateMovieDto: RateMovieDto = { rate: 5 };
      const movie = new Movie(
        false,
        'path1',
        1,
        'en',
        'Movie 1',
        'overview',
        5,
        'path',
        new Date(),
        'Movie 1',
      );

      movie.status = EStatusMovie.ASSISTIDO;
      movie.rate = 5;
      jest.spyOn(repository, 'findOneBy').mockResolvedValueOnce(movie);
      jest.spyOn(repository, 'update').mockResolvedValueOnce(undefined);

      await service.rateMovie(movieId, rateMovieDto);

      expect(movie.status).toBe(EStatusMovie.AVALIADO);
      expect(movie.rate).toBe(5);
      expect(repository.update).toHaveBeenCalledWith({ id: movieId }, movie);
    });

    it('should throw NotFoundException if movie is not found', async () => {
      const movieId = '1';
      const rateMovieDto: RateMovieDto = { rate: 5 };

      jest.spyOn(repository, 'findOneBy').mockResolvedValueOnce(null);

      await expect(service.rateMovie(movieId, rateMovieDto)).rejects.toThrow(
        new NotFoundException('MovieId does not exists'),
      );
    });

    it('should throw BadRequestException if movie status is "ASSISTIR"', async () => {
      const movieId = '1';
      const rateMovieDto: RateMovieDto = { rate: 5 };
      const movie = new Movie(
        true,
        'path1',
        1,
        'en',
        'Movie 1',
        'overview',
        5,
        'path',
        new Date(),
        'Movie 1',
      );

      movie.status = EStatusMovie.ASSISTIR;

      jest.spyOn(repository, 'findOneBy').mockResolvedValueOnce(movie);

      await expect(service.rateMovie(movieId, rateMovieDto)).rejects.toThrow(
        new BadRequestException('the movie status can only be changed if the movie is watched'),
      );
    });

    it('should throw BadRequestException if movie was already rated', async () => {
      const movieId = '1';
      const rateMovieDto: RateMovieDto = { rate: 5 };
      const movie = new Movie(
        false,
        'path1',
        1,
        'en',
        'Movie 1',
        'overview',
        5,
        'path',
        new Date(),
        'Movie 1',
      );

      movie.status = EStatusMovie.RECOMENDADO;

      jest.spyOn(repository, 'findOneBy').mockResolvedValueOnce(movie);

      await expect(service.rateMovie(movieId, rateMovieDto)).rejects.toThrow(
        new BadRequestException('the movie was already rated'),
      );
    });

    it('should throw InternalServerErrorException on unexpected errors', async () => {
      const movieId = '1';
      const rateMovieDto: RateMovieDto = { rate: 5 };

      jest.spyOn(repository, 'findOneBy').mockRejectedValueOnce(new Error('Unexpected error'));

      await expect(service.rateMovie(movieId, rateMovieDto)).rejects.toThrow(
        new InternalServerErrorException('Error to rate movie'),
      );
    });
  });
});
