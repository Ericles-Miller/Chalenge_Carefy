import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import * as request from 'supertest';
import { MoviesController } from '../movies/movies.controller';
import { MoviesService } from '../movies/movies.service';
import { Movie } from '../movies/entities/movie.entity';
import { JwtAuthGuard } from 'src/accounts/auth/AuthGuards';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { LoggerModule } from 'nestjs-pino';
import * as dotenv from 'dotenv';
import { CustomLogger } from 'src/loggers/custom-logger';
import { Logger } from 'src/loggers/entities/logger.entity';
import { LoggerMiddleware } from 'src/loggers/loggers-middleware';
import { LoggerService } from 'src/loggers/logger.service';

dotenv.config();

@Module({
  imports: [
    LoggerModule,
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
      },
    }),
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
  providers: [
    LoggerService,
    CustomLogger,
    MoviesService,
    {
      provide: JwtAuthGuard,
      useValue: { canActivate: () => true },
    },
  ],
})
class TestWrapperModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}

describe('LogsController (Integration Test)', () => {
  let app: INestApplication;
  let jwtService: JwtService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TestWrapperModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    jwtService = moduleFixture.get<JwtService>(JwtService);
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able to get all logs of database', async () => {
    const payload = { id: '50fa90f1-8667-4c70-ab21-a0d4d6bb68a7', username: 'user01' };
    const token = jwtService.sign(payload);

    const createMovieDto = {
      name: 'Gladiator',
    };

    const response = await request(app.getHttpServer())
      .post('/movies')
      .set('Authorization', `Bearer ${token}`)
      .send(createMovieDto)
      .expect(201);

    expect(response.body.length).toBe(1);
    expect(response.body[0].original_title).toBe('Gladiator');
    expect(response.body[0].id).toBeDefined();
  });
});
