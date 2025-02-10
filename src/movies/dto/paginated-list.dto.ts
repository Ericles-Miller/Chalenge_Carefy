import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class PaginatedListDto<T> {
  @ApiProperty()
  @Expose()
  data: T;

  @ApiProperty()
  @Expose()
  total: number;

  @ApiProperty()
  @Expose()
  page: number;

  @ApiProperty()
  @Expose()
  lastPage: number;
}
