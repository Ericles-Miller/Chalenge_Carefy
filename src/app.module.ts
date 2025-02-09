import { Module } from '@nestjs/common';
import { MoviesModule } from './movies/movies.module';
import { AccountsModule } from './accounts/accounts.module';
import { dataSourceOptions } from './database/dataSource';
import { LoggersModule } from './loggers/loggers.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    MoviesModule,
    AccountsModule,
    TypeOrmModule.forRoot(dataSourceOptions),
    LoggersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
