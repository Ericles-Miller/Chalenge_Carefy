import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { EStatusMovie } from '../status-movie.enum';

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

  @Column({ unique: true })
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

  @Column({ default: 0 })
  rate: number;

  @Column({ default: EStatusMovie.ASSISTIR })
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
