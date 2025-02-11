import { Test, TestingModule } from '@nestjs/testing';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movie } from './entities/movie.entity';
import { HttpModule } from '@nestjs/axios';
import { JwtModule } from '@nestjs/jwt';
import { Response } from 'express';
import { Logger } from 'nestjs-pino';
import { LoggersModule } from 'src/loggers/loggers.module';

describe('MoviesController (Integration Test)', () => {
  let controller: MoviesController;
  let service: MoviesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        LoggersModule,
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
      controllers: [MoviesController],
      providers: [MoviesService],
    }).compile();

    controller = module.get<MoviesController>(MoviesController);
    service = module.get<MoviesService>(MoviesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('suit tests movie controller (Integration Test)', () => {
    it('should be able to create a new movie', async () => {
      const mockResponse = {
        locals: { id: '50fa90f1-8667-4c70-ab21-a0d4d6bb68a7' },
        set: jest.fn(),
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      } as unknown as Response;

      const movieData = { name: 'The Batman' };

      await controller.create(movieData, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(201);

      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          originalTitle: 'The Batman',
        }),
      );
    });
  });
});
