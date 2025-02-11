import { Test, TestingModule } from '@nestjs/testing';
import { LoggerService } from './logger.service';
import { Logger } from './entities/logger.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ELoggerLevel } from './logger-level.enum';
import { InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { EActionType } from './action-type.enum';

describe('LoggerService', () => {
  let service: LoggerService;
  let repository: Repository<Logger>;

  const loggers: Logger[] = [
    {
      id: '335ecab5-4e51-4bfe-9e3b-4dd115e7a47b',
      method: 'GET',
      url: 'http://localhost:3000/logs',
      statusCode: 200,
      ip: '127.0.0.1',
      level: ELoggerLevel.INFO,
      timeRequest: 100,
      movieId: '',
      timestamp: new Date(),
      actionType: EActionType.OTHER,
      createdAt: new Date(),
      movie: undefined,
    },
  ];

  const mockRepository = {
    findOne: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoggerService,
        {
          provide: getRepositoryToken(Logger),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<LoggerService>(LoggerService);
    repository = module.get<Repository<Logger>>(getRepositoryToken(Logger));
    mockRepository.save.mockClear();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });

  describe('suite tests logRequest', () => {
    it('should be a new info log with success', async () => {
      const log = {
        method: 'GET',
        url: 'http://localhost:3000/logs',
        statusCode: 200,
        ip: '127.0.0.1',
        level: ELoggerLevel.INFO,
        timeRequest: 100,
        actionType: EActionType.OTHER,
        movieId: undefined,
      };

      await service.logRequest(
        log.method,
        log.url,
        log.statusCode,
        log.ip,
        log.level,
        log.timeRequest,
        log.actionType,
        log.movieId,
      );

      expect(repository.save).toHaveBeenCalledTimes(1);
      expect(log.level).toBe(ELoggerLevel.INFO);
    });

    it('should be a new warn log with success', async () => {
      const log = {
        method: 'GET',
        url: 'http://localhost:3000/logs',
        statusCode: 200,
        ip: '127.0.0.1',
        level: ELoggerLevel.WARN,
        timeRequest: 100,
        actionType: EActionType.OTHER,
        movieId: '',
      };

      await service.logRequest(
        log.method,
        log.url,
        log.statusCode,
        log.ip,
        log.level,
        log.timeRequest,
        log.actionType,
        log.movieId,
      );

      expect(repository.save).toHaveBeenCalledTimes(1);
      expect(log.level).toBe(ELoggerLevel.WARN);
    });

    it('should be a new error log with success', async () => {
      const log = {
        method: 'GET',
        url: 'http://localhost:3000/logs',
        statusCode: 200,
        ip: '127.0.0.1',
        level: ELoggerLevel.ERROR,
        timeRequest: 100,
        actionType: EActionType.OTHER,
        movieId: '',
      };

      await service.logRequest(
        log.method,
        log.url,
        log.statusCode,
        log.ip,
        log.level,
        log.timeRequest,
        log.actionType,
        log.movieId,
      );

      expect(repository.save).toHaveBeenCalledTimes(1);
      expect(log.level).toBe(ELoggerLevel.ERROR);
    });

    it('should throw InternalServerErrorException on unexpected error', async () => {
      jest.spyOn(repository, 'save').mockRejectedValue(new Error('Error saving log'));
      const log = {
        method: 'GET',
        url: 'http://localhost:3000/logs',
        statusCode: 200,
        ip: '127.0.0.1',
        level: ELoggerLevel.INFO,
        timeRequest: 100,
        actionType: EActionType.OTHER,
        movieId: '',
      };

      await expect(
        service.logRequest(
          log.method,
          log.url,
          log.statusCode,
          log.ip,
          log.level,
          log.timeRequest,
          log.actionType,
          log.movieId,
        ),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('suit tests getLogs', () => {
    it('should be able to get all logs', async () => {
      jest.spyOn(repository, 'find').mockResolvedValue(loggers);
      const result = await service.getLogs();

      expect(result).toEqual(loggers);
      expect(repository.find).toHaveBeenCalledTimes(1);
    });

    it('should throw InternalServerErrorException on unexpected error', async () => {
      jest.spyOn(repository, 'find').mockRejectedValue(new Error('Error finding log  '));

      await expect(service.getLogs()).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('suit tests findLog', () => {
    it('should be able to find log by id', async () => {
      const log: Logger = {
        id: '335ecab5-4e51-4bfe-9e3b-4dd115e7a47b',
        method: 'GET',
        url: 'http://localhost:3000/logs',
        statusCode: 200,
        ip: '127.0.0.1',
        level: ELoggerLevel.INFO,
        timeRequest: 100,
        movieId: '',
        actionType: EActionType.OTHER,
        timestamp: new Date(),
        createdAt: new Date(),
        movie: undefined,
      };

      jest.spyOn(repository, 'findOne').mockResolvedValue(log);

      const result = await service.findLog('335ecab5-4e51-4bfe-9e3b-4dd115e7a47b');

      expect(result).toEqual(log);
      expect(repository.findOne).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundException on unexpected error', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(undefined);

      await expect(service.findLog('335ecab5-4e51-4bfe-9e3b-4dd115e7a47b')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
