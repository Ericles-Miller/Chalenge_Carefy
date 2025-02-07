import { Module } from '@nestjs/common';
import { MoviesModule } from './movies/movies.module';
import { AccountsModule } from './accounts/accounts.module';

@Module({
  imports: [MoviesModule, AccountsModule, TypeOrmModule.forRoot(dataSourceOptions), LoggersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
