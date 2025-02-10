import { ApiProperty } from '@nestjs/swagger';
import { EStatusMovie } from '../status-movie.enum';
import { IsEnum } from 'class-validator';

export class UpdateStatusMovieDto {
  @ApiProperty({ enum: EStatusMovie, enumName: 'EStatusMovie' })
  @IsEnum(EStatusMovie)
  statusMovie: EStatusMovie;
}
