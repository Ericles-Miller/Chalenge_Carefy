import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MoviesModule } from './movies/movies.module';
import { AccountsModule } from './accounts/accounts.module';
import { dataSourceOptions } from './database/dataSource';
import { LoggersModule } from './loggers/loggers.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GetPayloadUserMiddleware } from './accounts/auth/get-payload-user-middleware';
import { HttpModule } from '@nestjs/axios';
import { SeedService } from './database/seed-service';

@Module({
  imports: [
    MoviesModule,
    AccountsModule,
    TypeOrmModule.forRoot(dataSourceOptions),
    LoggersModule,
    HttpModule,
  ],
  controllers: [],
  providers: [SeedService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(GetPayloadUserMiddleware).forRoutes('movies');
  }
}
