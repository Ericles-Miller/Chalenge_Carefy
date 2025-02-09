import { Controller, Get, HttpCode, Param } from '@nestjs/common';
import { LoggerService } from './logger.service';
import { Logger } from './entities/logger.entity';

@Controller('logs')
export class LoggerController {
  constructor(private readonly logsService: LoggerService) {}

  @Get('')
  @HttpCode(200)
  async getLogs(): Promise<Logger[]> {
    return await this.logsService.getLogs();
  }

  @Get(':id')
  @HttpCode(200)
  async getLogById(@Param('id') id: string): Promise<Logger> {
    return await this.logsService.findLog(id);
  }
}
