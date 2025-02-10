import { Controller, Get, Post, Body, Param, UseGuards, Req, Query, Put } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { AuthGuard } from 'src/accounts/auth/AuthGuards';
import { ApiBearerAuth, ApiBody, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { RequestWithUser } from 'src/types/request-with-user';
import { PaginatedListDto } from './dto/paginated-list.dto';
import { Movie } from './entities/movie.entity';
import { RateMovieDto } from './dto/rate-movie.dto';
import { UpdateStatusMovieDto } from './dto/update-movie.dto';
import { EStatusMovie } from './status-movie.enum';

@Controller('movies')
@ApiTags('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Post()
  @ApiBearerAuth('sessionAuth')
  @UseGuards(AuthGuard)
  async create(@Body() createMovieDto: CreateMovieDto, @Req() request: RequestWithUser) {
    const user = request.user;
    return await this.moviesService.create(createMovieDto);
  }

  @Get('')
  @ApiBearerAuth('sessionAuth')
  @UseGuards(AuthGuard)
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({
    name: 'statusMovie',
    enum: EStatusMovie,
    enumName: 'EStatusMovie',
    example: 'Recomendado',
    description: 'status of movie',
    required: false,
  })
  async findAll(
    @Query('statusMovie') statusMovie?: EStatusMovie,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ): Promise<PaginatedListDto<Movie[]>> {
    const pageNumber = Number(page) > 0 ? Number(page) : 1;
    const limitNumber = Number(limit) > 0 ? Number(limit) : 10;

    return await this.moviesService.findAll(pageNumber, limitNumber, statusMovie);
  }

  @Get(':id/')
  @ApiBearerAuth('sessionAuth')
  @UseGuards(AuthGuard)
  async findOne(@Param('id') id: string): Promise<Movie> {
    return await this.moviesService.findOne(id);
  }

  @Post(':id/avaliar')
  @ApiBearerAuth('sessionAuth')
  @UseGuards(AuthGuard)
  async rateMovie(@Param('id') id: string, @Body() rateMovieDto: RateMovieDto): Promise<void> {
    return await this.moviesService.rateMovie(id, rateMovieDto);
  }

  @Put(':id/estado')
  @ApiBearerAuth('sessionAuth')
  @UseGuards(AuthGuard)
  @ApiBody({
    type: UpdateStatusMovieDto,
    required: true,
  })
  async updateStateMovieDatabase(
    @Param('id') id: string,
    @Body() updateStatusMovieDto: UpdateStatusMovieDto,
  ): Promise<void> {
    return await this.moviesService.updateStateMovieDatabase(id, updateStatusMovieDto);
  }
}
