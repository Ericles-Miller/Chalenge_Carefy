import { Test, TestingModule } from '@nestjs/testing';
import { LoggerController } from './logger.controller';
import { LoggerService } from './logger.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Logger } from './entities/logger.entity';
import { ELoggerLevel } from './logger-level.enum';

describe('LogsController (Integration Test)', () => {
  let controller: LoggerController;
  let service: LoggerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [Logger],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([Logger]),
      ],
      controllers: [LoggerController],
      providers: [LoggerService],
    }).compile();

    controller = module.get<LoggerController>(LoggerController);
    service = module.get<LoggerService>(LoggerService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('suit tests getLogs (Integration Test)', () => {
    it('should be able to get all logs of database', async () => {
      await service.logRequest('GET', 'http://localhost:3000/logs', 200, '127.0.0.1', ELoggerLevel.INFO, 100);
      await service.logRequest('GET', 'http://localhost:3000/logs', 404, '127.0.0.1', ELoggerLevel.WARN, 100);

      const result = await controller.getLogs();

      expect(result.length).toBe(2);
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

  describe('suit tests findLog (Integration Test)', () => {
    it('should be able to find log by id', async () => {
      await service.logRequest('GET', 'http://localhost:3000/logs', 200, '127.0.0.1', ELoggerLevel.INFO, 100);
      const logs = await service.getLogs();

      const result = await controller.getLogById(logs[0].id);

      expect(result.id).toBe(logs[0].id);
      expect(result.method).toBe(logs[0].method);
      expect(result.url).toBe(logs[0].url);
      expect(result.statusCode).toBe(logs[0].statusCode);
      expect(result.ip).toBe(logs[0].ip);
      expect(result.level).toBe(logs[0].level);
      expect(result.timeRequest).toBe(logs[0].timeRequest);
    });
  });
});
