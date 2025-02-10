import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { EStatusMovie } from '../status-movie.enum';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

@Entity('movie')
export class Movie {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  @Expose()
  id: string;

  @Column()
  @ApiProperty()
  @Expose()
  adult: boolean;

  @Column()
  @ApiProperty()
  @Expose()
  backdropPath: string;

  @Column()
  @ApiProperty()
  @Expose()
  ApiMovieId: number;

  @Column()
  @ApiProperty()
  @Expose()
  originalLanguage: string;

  @Column({ unique: true })
  @ApiProperty()
  @Expose()
  originalTitle: string;

  @Column()
  @ApiProperty()
  @Expose()
  overview: string;

  @Column()
  @ApiProperty()
  @Expose()
  popularity: number;

  @Column()
  @ApiProperty()
  @Expose()
  posterPath: string;

  @Column()
  @ApiProperty()
  @Expose()
  releaseDate: Date;

  @Column()
  @ApiProperty()
  @Expose()
  title: string;

  @Column({ default: 0 })
  @ApiProperty()
  @Expose()
  rate: number;

  @Column({ default: EStatusMovie.ASSISTIR })
  @ApiProperty()
  @Expose()
  status: EStatusMovie;

  constructor(
    adult: boolean,
    backdropPath: string,
    ApiMovieId: number,
    originalLanguage: string,
    originalTitle: string,
    overview: string,
    popularity: number,
    posterPath: string,
    releaseDate: Date,
    title: string,
  ) {
    this.adult = adult;
    this.backdropPath = backdropPath;
    this.ApiMovieId = ApiMovieId;
    this.originalLanguage = originalLanguage;
    this.originalTitle = originalTitle;
    this.overview = overview;
    this.popularity = popularity;
    this.posterPath = posterPath;
    this.releaseDate = releaseDate;
    this.title = title;
  }

  setRate(rate: number): void {
    this.rate = rate;
  }

  setStatus(status: EStatusMovie): void {
    this.status = status;
  }
}
