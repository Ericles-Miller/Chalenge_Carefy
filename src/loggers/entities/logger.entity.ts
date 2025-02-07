import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ELoggerLevel } from '../logger-level.enum';

@Entity('loggers')
export class Logger {
  @PrimaryGeneratedColumn('uuid')
  id: string;

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

  @Column()
  level: ELoggerLevel;

  @Column()
  timeRequest: number;

  constructor(
    method: string,
    url: string,
    statusCode: number,
    level: ELoggerLevel,
    moveId: string,
    ip: string,
    timeRequest: number,
  ) {
    this.method = method;
    this.url = url;
    this.level = level;
    this.movieId = moveId;
    this.ip = ip;
    this.timeRequest = timeRequest;
    this.statusCode = statusCode;
  }
}
