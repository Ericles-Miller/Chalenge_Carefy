import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Logger } from './entities/logger.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ELoggerLevel } from './logger-level.enum';

@Injectable()
export class LoggerService {
  constructor(@InjectRepository(Logger) private readonly logRepository: Repository<Logger>) {}

  async logRequest(
    method: string,
    url: string,
    statusCode: number,
    ip: string,
    level: ELoggerLevel,
    timeRequest: number,
    movieId?: string,
  ): Promise<void> {
    try {
      const log = new Logger(method, url, statusCode, level, movieId, ip, timeRequest);

      await this.logRepository.save(log);
    } catch {
      throw new InternalServerErrorException('Error saving log');
    }
  }

  async getLogs(): Promise<Logger[]> {
    try {
      return await this.logRepository.find();
    } catch {
      throw new InternalServerErrorException('Error finding log');
    }
  }

  async findLog(id: string): Promise<Logger> {
    try {
      const log = await this.logRepository.findOne({ where: { id } });

      if (!log) {
        throw new NotFoundException('id of log does not exists');
      }
      return log;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      throw new InternalServerErrorException('Error finding log');
    }
  }
}
