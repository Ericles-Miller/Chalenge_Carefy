import { ApiProperty } from '@nestjs/swagger';
import { Max, Min } from 'class-validator';

export class RateMovieDto {
  @ApiProperty()
  @Min(1)
  @Max(5)
  rate: number;
}
