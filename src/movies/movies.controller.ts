import { Controller, Get, Post, Body, Param, UseGuards, Req, Query, Put } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { AuthGuard } from 'src/accounts/auth/AuthGuards';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
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
  @ApiOperation({
    summary: 'isnert movie to favorite list',
    description: `
    sample request: 
    POST /movies
    REQUEST BODY:
    {
      "name": "name movie"
    }
    `,
  })
  @ApiResponse({
    status: 201,
    type: Movie,
    description: 'Create movies successfully',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  @ApiResponse({
    status: 400,
    description: 'bad request to send data',
  })
  @ApiResponse({
    status: 401,
    description: 'unauthorized',
  })
  async create(@Body() createMovieDto: CreateMovieDto, @Req() request: RequestWithUser): Promise<Movie> {
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
  @ApiOperation({
    summary: 'find all movie to favorite list paginated',
    description: `
    sample request: find movies with filter RECOMENDADO
    Get /movies?page=1&limit=10&statusMovie=Recomendado
    
    sample request: find movies with filter NAO_RECOMENDADO
    Get /movies?page=1&limit=10&statusMovie=Nao recomendado

    sample request: find movies with filter AVALIADO
    Get /movies?page=1&limit=10&statusMovie=Avaliado

    sample request: find movies with filter ASSISTIDO
    Get /movies?page=1&limit=10&statusMovie=Assistido

    sample request: find movies with filter ASSISTIR
    Get /movies?page=1&limit=10&statusMovie=ASSISTIR

    sample request: find movies without statusMovie and paginated default
    Get /movies?page=1&limit=10

    sample request: find movies without statusMovie and paginated not default
    Get /movies?page=3&limit=5
    `,
  })
  @ApiResponse({
    status: 200,
    type: PaginatedListDto<[Movie]>,
    description: 'Find all movies with filters successfully',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  @ApiResponse({
    status: 401,
    description: 'unauthorized',
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

  @Get(':id')
  @ApiBearerAuth('sessionAuth')
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'find movie with id',
    description: `
    sample request: find movies with id
    Get /movies/8abcb8a5-9709-41c7-85df-08a44fd1c6f4
    `,
  })
  @ApiResponse({
    status: 404,
    description: 'MovieId does not exists',
  })
  @ApiResponse({
    status: 200,
    type: Movie,
    description: 'Find movie successfully',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  @ApiResponse({
    status: 401,
    description: 'unauthorized',
  })
  async findOne(@Param('id') id: string): Promise<Movie> {
    return await this.moviesService.findOne(id);
  }

  @Post(':id/avaliar')
  @ApiBearerAuth('sessionAuth')
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'find movie with id',
    description: `
    sample request: rate movie
    POST /movies/8abcb8a5-9709-41c7-85df-08a44fd1c6f4/avaliar
    REQUEST BODY: 
    {
      rate: 3
    }
    `,
  })
  @ApiResponse({
    status: 404,
    description: 'MovieId does not exists',
  })
  @ApiResponse({
    status: 200,
    type: Movie,
    description: 'Rate movie successfully',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  @ApiResponse({
    status: 401,
    description: 'unauthorized',
  })
  @ApiResponse({
    status: 400,
    description: 'error in status movie',
  })
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
  @ApiOperation({
    summary: 'find movie with id',
    description: `
    sample request: rate movie
    PUT /movies/8abcb8a5-9709-41c7-85df-08a44fd1c6f4/estado
    REQUEST BODY: 
    {
      statusMovie: "Assitir"
    }
    `,
  })
  @ApiResponse({
    status: 404,
    description: 'MovieId does not exists',
  })
  @ApiResponse({
    status: 200,
    description: 'update status movie successfully',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  @ApiResponse({
    status: 401,
    description: 'unauthorized',
  })
  @ApiResponse({
    status: 400,
    description: 'error in status movie',
  })
  async updateStateMovieDatabase(
    @Param('id') id: string,
    @Body() updateStatusMovieDto: UpdateStatusMovieDto,
  ): Promise<void> {
    return await this.moviesService.updateStateMovieDatabase(id, updateStatusMovieDto);
  }
}
