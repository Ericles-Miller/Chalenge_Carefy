import { Test, TestingModule } from '@nestjs/testing';
import { LoggerController } from './logger.controller';
import { LoggerService } from './logger.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Logger } from './entities/logger.entity';
import { ELoggerLevel } from './logger-level.enum';
import * as request from 'supertest';
import { Movie } from 'src/movies/entities/movie.entity';
import { MoviesModule } from 'src/movies/movies.module';
import { INestApplication } from '@nestjs/common';
import { MoviesController } from 'src/movies/movies.controller';
import { CreateMovieDto } from 'src/movies/dto/create-movie.dto';
import { Response } from 'express';
import { MoviesService } from 'src/movies/movies.service';

describe('LogsController (Integration Test)', () => {
  let moviesController: MoviesController;
  let response: Response;
  let controller: LoggerController;
  let service: LoggerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:', // Banco de dados em memória
          entities: [Movie, Logger], // Adiciona Movie e Log para capturar os logs
          synchronize: true, // Cria as tabelas automaticamente
        }),
        TypeOrmModule.forFeature([Movie, Logger]), // Injeta os repositórios
      ],
      controllers: [MoviesController, LoggerController],
      providers: [MoviesService, LoggerService],
    }).compile();

    moviesController = module.get<MoviesController>(MoviesController);
    controller = module.get<LoggerController>(LoggerController);
    service = module.get<LoggerService>(LoggerService);

    response = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      locals: {},
    } as unknown as Response;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('suit tests getLogs (Integration Test)', () => {
    it('should be able to get all logs of database', async () => {
      const createMovieDto: CreateMovieDto = { name: 'Interstellar' };
      await moviesController.create(createMovieDto, response);

      const result = await controller.getLogs();

      expect(result.length).toBe(1);
      expect(result[0].method).toBe('GET');
      expect(result[0].url).toBe('http://localhost:3000/logs');
      expect(result[0].statusCode).toBe(200);
      expect(result[0].ip).toBe('127.0.0.1');
      expect(result[0].level).toBe(ELoggerLevel.INFO);
      expect(result[0].timeRequest).toBe(100);

      expect(result[1].method).toBe('GET');
      expect(result[1].url).toBe('http://localhost:3000/logs');
      expect(result[1].statusCode).toBe(404);
      expect(result[1].ip).toBe('127.0.0.1');
      expect(result[1].level).toBe(ELoggerLevel.WARN);
      expect(result[1].timeRequest).toBe(100);
    });
  });

  // describe('suit tests findLog (Integration Test)', () => {
  //   it('should be able to find log by id', async () => {
  //     await service.logRequest(
  //       'GET',
  //       'http://localhost:3000/logs',
  //       200,
  //       '127.0.0.1',
  //       ELoggerLevel.INFO,
  //       100,
  //       EActionType.GET,
  //       '50fa90f1-8667-4c70-ab21-a0d4d6bb68a7',
  //     );
  //     const logs = await service.getLogs();

  //     const result = await controller.getLogById(logs[0].id);

  //     expect(result.id).toBe(logs[0].id);
  //     expect(result.method).toBe(logs[0].method);
  //     expect(result.url).toBe(logs[0].url);
  //     expect(result.statusCode).toBe(logs[0].statusCode);
  //     expect(result.ip).toBe(logs[0].ip);
  //     expect(result.level).toBe(logs[0].level);
  //     expect(result.timeRequest).toBe(logs[0].timeRequest);
  //   });
  // });
});
