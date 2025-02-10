import { Controller, Get, Post, Body, Patch, Param, UseGuards, Req, Query } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { AuthGuard } from 'src/accounts/auth/AuthGuards';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { RequestWithUser } from 'src/types/request-with-user';
import { PaginatedListDto } from './dto/paginated-list.dto';
import { Movie } from './entities/movie.entity';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Post()
  @ApiBearerAuth('sessionAuth')
  @UseGuards(AuthGuard)
  async create(@Body() createMovieDto: CreateMovieDto, @Req() request: RequestWithUser) {
    const user = request.user;
    return await this.moviesService.create(createMovieDto, user.accountId, user.sessionId);
  }

  @Get('database')
  @ApiBearerAuth('sessionAuth')
  @UseGuards(AuthGuard)
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async findAllDatabase(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ): Promise<PaginatedListDto<Movie[]>> {
    const pageNumber = Number(page) > 0 ? Number(page) : 1;
    const limitNumber = Number(limit) > 0 ? Number(limit) : 10;

    return await this.moviesService.findAllDatabase(pageNumber, limitNumber);
  }

  @Get('api')
  @Get('database')
  @ApiBearerAuth('sessionAuth')
  @ApiQuery({ name: 'page', required: false, type: Number })
  async findAllAPI(
    @Req() request: RequestWithUser,
    @Query('page') page?: string,
  ): Promise<PaginatedListDto<any[]>> {
    const user = request.user;
    const pageNumber = Number(page) > 0 ? Number(page) : 1;
    return await this.moviesService.findAllApi(user.accountId, user.sessionId, pageNumber);
  }

  @Get(':id/database')
  @ApiBearerAuth('sessionAuth')
  @UseGuards(AuthGuard)
  async findOneDatabase(@Param('id') id: string): Promise<Movie> {
    return await this.moviesService.findOneDatabase(id);
  }

  @Get(':id/api')
  @ApiBearerAuth('sessionAuth')
  @UseGuards(AuthGuard)
  async findOneApi(@Param('id') id: number): Promise<any> {
    return await this.moviesService.findOneApi(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMovieDto: UpdateMovieDto) {
    return this.moviesService.update(+id, updateMovieDto);
  }
}
