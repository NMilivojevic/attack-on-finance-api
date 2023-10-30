import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as fs from 'fs';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      // host: process.env.DB_HOST,
      host: 'primary.database--mk9dz67f74fp.addon.code.run',
      // port: parseInt(process.env.DB_PORT),
      port: 5432,
      // username: process.env.DB_USERNAME,
      username: '_0dabc1f26c2fc72f',
      // password: process.env.DB_PASSWORD,
      password: '_44abadb2bf44c9cfdbfed522d49d7d',
      // database: process.env.DB_DATABASE,
      database: '_06907542705f',
      ssl: {
        ca: fs.readFileSync(process.env.SSL_CA_CERTIFICATES),
      },
      autoLoadEntities: true,
      // Only enable this option if your application is in development,
      // otherwise use TypeORM migrations to sync entity schemas:
      // https://typeorm.io/#/migrations
      synchronize: true,
    }),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
