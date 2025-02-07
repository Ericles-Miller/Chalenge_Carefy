import { LoggerService } from './logger.service';
import { CustomLogger } from './custom-logger';
import { Request, Response, NextFunction } from 'express';
import { LoggerMiddleware } from './loggers-middleware';

describe('LoggerMiddleware', () => {
  let middleware: LoggerMiddleware;
  let mockLoggerService: Partial<LoggerService>;
  let mockCustomLogger: Partial<CustomLogger>;
  let request: Partial<Request>;
  let response: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    mockLoggerService = {
      logRequest: jest.fn(),
    };

    mockCustomLogger = {
      log: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      debug: jest.fn(),
      verbose: jest.fn(),
    };

    middleware = new LoggerMiddleware(mockLoggerService as LoggerService, mockCustomLogger as CustomLogger);

    request = {
      method: 'GET',
      originalUrl: '/test',
      ip: '127.0.0.1',
      params: { movieId: '123' },
    };

    response = {
      statusCode: 200,
      on: jest.fn(function (this: Response, event: string, callback: () => void) {
        if (event === 'finish') callback();
        return this;
      }),
    } as Partial<Response>;

    next = jest.fn();
  });

  it('should call logRequest and log when response is successful', () => {
    middleware.use(request as Request, response as Response, next);

    expect(mockLoggerService.logRequest).toHaveBeenCalledWith(
      'GET',
      '/test',
      200,
      '127.0.0.1',
      expect.any(String),
      expect.any(Number),
      '123',
    );

    expect(mockCustomLogger.log).toHaveBeenCalledWith(expect.stringContaining('GET /test 200'), 'HTTP');
  });

  it('should call error log when statusCode is 500', () => {
    response.statusCode = 500;
    middleware.use(request as Request, response as Response, next);

    expect(mockCustomLogger.error).toHaveBeenCalledWith(expect.stringContaining('GET /test 500'), 'HTTP');
  });

  it('should call warn log when statusCode is 400', () => {
    response.statusCode = 400;
    middleware.use(request as Request, response as Response, next);

    expect(mockCustomLogger.warn).toHaveBeenCalledWith(expect.stringContaining('GET /test 400'), 'HTTP');
  });

  it('should call next()', () => {
    middleware.use(request as Request, response as Response, next);
    expect(next).toHaveBeenCalled();
  });
});
