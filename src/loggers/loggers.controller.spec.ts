import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { MoviesController } from '../movies/movies.controller';
import { MoviesService } from '../movies/movies.service';
import { Movie } from '../movies/entities/movie.entity';
import { Logger } from './entities/logger.entity';
import { Response } from 'express';
import { CreateMovieDto } from 'src/movies/dto/create-movie.dto';
import { LoggerController } from './logger.controller';
import { LoggerService } from './logger.service';
import { JwtAuthGuard } from 'src/accounts/auth/AuthGuards';
import { JwtModule, JwtService } from '@nestjs/jwt';
import * as dotenv from 'dotenv';

dotenv.config();

describe('LogsController (Integration Test)', () => {
  let controller: LoggerController;
  let service: LoggerService;
  let moviesController: MoviesController;
  let moviesService: MoviesService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [Movie, Logger],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([Movie, Logger]),
        HttpModule,
        JwtModule.register({
          secret: 'dc57f9ec-c6b2-477f-a6af-fc57c1b86be0',
          signOptions: { expiresIn: '1h' },
        }),
      ],
      controllers: [LoggerController, MoviesController],
      providers: [
        LoggerService,
        MoviesService,
        {
          provide: JwtAuthGuard,
          useValue: { canActivate: () => true },
        },
      ],
    }).compile();

    controller = module.get<LoggerController>(LoggerController);
    service = module.get<LoggerService>(LoggerService);
    moviesController = module.get<MoviesController>(MoviesController);
    moviesService = module.get<MoviesService>(MoviesService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
    expect(moviesController).toBeDefined();
    expect(moviesService).toBeDefined();
    expect(JwtAuthGuard).toBeDefined();
  });

  describe('suit tests getLogs (Integration Test)', () => {
    it('should be able to get all logs of database', async () => {
      const payload = { id: '50fa90f1-8667-4c70-ab21-a0d4d6bb68a7', username: 'user01' };
      const token = jwtService.sign(payload);

      const createMovieDto: CreateMovieDto = {
        name: 'Gladiator',
      };

      const mockResponse = {
        locals: { id: '50fa90f1-8667-4c70-ab21-a0d4d6bb68a7' },
        set: jest.fn(),
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      } as unknown as Response;

      const createResponse = await moviesController.create(createMovieDto, mockResponse);
      createResponse.set('Authorization', `Bearer ${token}`);

      const result = await controller.getLogs();

      expect(result.length).toBe(1);
      expect(result[0].method).toBe('POST');
      expect(result[0].url).toBe('/movie');
    });
  });
});
