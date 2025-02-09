import { ApiProperty } from '@nestjs/swagger';

export class SessionTokenResponseDto {
  @ApiProperty()
  sessionId: string;
}
