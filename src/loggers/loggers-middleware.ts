import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { LoggerService } from './logger.service';
import { differenceInMilliseconds } from 'date-fns';
import { CustomLogger } from './custom-logger';
import { ELoggerLevel } from './logger-level.enum';
import { EActionType } from './action-type.enum';

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
      const movieId = request.params.id || response.locals.id;
      const timeRequest = differenceInMilliseconds(startTimeRequest, Date.now());

      let actionType: EActionType = EActionType.OTHER;
      if (method === 'POST' && originalUrl.startsWith('/movies')) {
        actionType = EActionType.CREATE;
      } else if (method === 'PUT' && originalUrl.startsWith('/movies')) {
        actionType = EActionType.UPDATE;
      } else if (method === 'GET' && originalUrl.startsWith('/movies')) {
        actionType = EActionType.GET;
      }

      const level =
        statusCode >= 500 ? ELoggerLevel.ERROR : statusCode >= 400 ? ELoggerLevel.WARN : ELoggerLevel.INFO;

      this.logsService.logRequest(
        method,
        originalUrl,
        statusCode,
        ip,
        level,
        timeRequest,
        actionType,
        movieId,
      );

      const logMessage = `${method} ${originalUrl} ${statusCode} TimeRequest ${timeRequest}ms - IP: ${ip} - Movie ID: ${movieId || 'N/A'} - Action: ${actionType}`;

      switch (level) {
        case ELoggerLevel.ERROR:
          this.customLogger.error(logMessage, 'HTTP');
          break;
        case ELoggerLevel.WARN:
          this.customLogger.warn(logMessage, 'HTTP');
          break;
        case ELoggerLevel.INFO:
          this.customLogger.log(logMessage, 'HTTP');
          break;
        default:
          this.customLogger.verbose(logMessage, 'HTTP');
      }
    });

    next();
  }
}
