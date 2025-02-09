import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class logoutAccountDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  sessionId: string;
}
