import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('movie')
export class Movie {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  adult: boolean;

  @Column()
  backdropPath: string;

  @Column()
  ApiMovieId: number;

  @Column()
  originalLanguage: string;

  @Column()
  originalTitle: string;

  @Column()
  overview: string;

  @Column()
  popularity: number;

  @Column()
  posterPath: string;

  @Column()
  releaseDate: Date;

  @Column()
  title: string;

  @Column()
  voteAverage: number;

  @Column()
  voteCount: number;

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
    voteAverage: number,
    voteCount: number,
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
    this.voteAverage = voteAverage;
    this.voteCount = voteCount;
  }
}
