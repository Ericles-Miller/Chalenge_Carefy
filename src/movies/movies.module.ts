import { Module } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { MoviesController } from './movies.controller';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movie } from './entities/movie.entity';
import { LoggersModule } from 'src/loggers/loggers.module';

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([Movie]), LoggersModule],
  controllers: [MoviesController],
  providers: [MoviesService],
})
export class MoviesModule {}
