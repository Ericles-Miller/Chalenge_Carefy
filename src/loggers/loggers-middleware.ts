import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { LoggerService } from './logger.service';
import { differenceInMilliseconds } from 'date-fns';
import { CustomLogger } from './custom-logger';
import { ELoggerLevel } from './logger-level.enum';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(
    private readonly logsService: LoggerService,
    private readonly customLogger: CustomLogger,
  ) {}

  async use(request: Request, response: Response, next: NextFunction): Promise<void> {
    const { method, originalUrl, ip } = request;
    const startTimeRequest = Date.now();

    response.on('finish', () => {
      const { statusCode } = response;
      const movieId = request.params.movieId;
      const timeRequest = differenceInMilliseconds(startTimeRequest, Date.now());

      const level =
        statusCode >= 500 ? ELoggerLevel.ERROR : statusCode >= 400 ? ELoggerLevel.WARN : ELoggerLevel.INFO;

      this.logsService.logRequest(method, originalUrl, statusCode, ip, level, timeRequest, movieId);

      if (level === ELoggerLevel.ERROR) {
        this.customLogger.error(
          `${method} ${originalUrl} ${statusCode}  TimeRequest ${timeRequest} mil - IP: ${ip} - Movie ID: ${movieId || 'N/A'}`,
          'HTTP',
        );
      } else if (level === ELoggerLevel.WARN) {
        this.customLogger.warn(
          `${method} ${originalUrl} ${statusCode} TimeRequest ${timeRequest} mil - IP: ${ip} - Movie ID: ${movieId || 'N/A'}`,
          'HTTP',
        );
      } else if (level === ELoggerLevel.INFO) {
        this.customLogger.log(
          `${method} ${originalUrl} ${statusCode} TimeRequest ${timeRequest} mil - IP: ${ip} - Movie ID: ${movieId || 'N/A'}`,
          'HTTP',
        );
      } else if (level === ELoggerLevel.DEBUG) {
        this.customLogger.debug(
          `${method} ${originalUrl} ${statusCode} TimeRequest ${timeRequest} mil - IP: ${ip} - Movie ID: ${movieId || 'N/A'}`,
          'HTTP',
        );
      } else {
        this.customLogger.verbose(
          `${method} ${originalUrl} ${statusCode} TimeRequest ${timeRequest} mil - IP: ${ip} - Movie ID: ${movieId || 'N/A'}`,
          'HTTP',
        );
      }
    });

    next();
  }
}
