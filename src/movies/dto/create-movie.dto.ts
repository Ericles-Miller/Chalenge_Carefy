import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateMovieDto {
  @ApiProperty()
  @ApiProperty()
  @IsString()
  name: string;
}
