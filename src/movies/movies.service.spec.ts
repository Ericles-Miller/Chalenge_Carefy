import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { Movie } from './entities/movie.entity';
import { CreateMovieDto } from './dto/create-movie.dto';
import { MovieDto } from './dto/movie.dto';
import { LoggerService } from 'src/loggers/logger.service';
import { Logger } from 'nestjs-pino';

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

      await expect(service.create(createMovieDto)).rejects.toThrowError(
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

      await expect(service.create(createMovieDto)).rejects.toThrowError(
        new BadRequestException('Movie already exists in favorite list'),
      );
    });

    it('should throw InternalServerErrorException if an unexpected error occurs', async () => {
      const createMovieDto: CreateMovieDto = { name: 'The Batman' };

      jest.spyOn(httpService.axiosRef, 'get').mockRejectedValueOnce(new Error('Something went wrong'));

      await expect(service.create(createMovieDto)).rejects.toThrowError(
        new InternalServerErrorException('Internal server error to create movie'),
      );
    });
  });
});
