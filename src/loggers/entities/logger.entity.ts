import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ELoggerLevel } from '../logger-level.enum';
import { EActionType } from '../action-type.enum';
import { Movie } from 'src/movies/entities/movie.entity';

@Entity('loggers')
export class Logger {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  method: string;

  @Column()
  url: string;

  @Column()
  statusCode: number;

  @Column({ default: Date.now })
  timestamp: Date;

  @Column({ nullable: true })
  movieId?: string;

  @Column()
  ip: string;

  @Column({ default: ELoggerLevel.INFO })
  level: ELoggerLevel;

  @Column()
  timeRequest: number;

  @Column({ default: EActionType.OTHER })
  actionType: EActionType;

  @ManyToOne(() => Movie, (movie) => movie.loggers)
  movie: Movie;

  constructor(
    method: string,
    url: string,
    statusCode: number,
    level: ELoggerLevel,
    moveId: string,
    ip: string,
    timeRequest: number,
    actionType: EActionType,
  ) {
    this.method = method;
    this.url = url;
    this.level = level;
    this.movieId = moveId;
    this.ip = ip;
    this.timeRequest = timeRequest;
    this.statusCode = statusCode;
    this.actionType = actionType;
  }
}
