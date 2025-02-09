import { Controller, Get, Post, Body, Patch, Param, UseGuards, Req } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { AuthGuard } from 'src/accounts/auth/AuthGuards';
import { ApiBearerAuth } from '@nestjs/swagger';
import { RequestWithUser } from 'src/types/request-with-user';

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

  @Get()
  findAll() {
    return this.moviesService.findAll();
  }

  @Get(':id')
  @ApiBearerAuth('sessionAuth')
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string) {
    return this.moviesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMovieDto: UpdateMovieDto) {
    return this.moviesService.update(+id, updateMovieDto);
  }
}
