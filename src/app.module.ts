import { Module } from '@nestjs/common';

//environment variables
import { ConfigModule } from '@nestjs/config';
//validation of environment variables
import { envVarsSchema } from './config/joi.validation';
import { EnvConfig } from './config/app.config';

//other modules
import { ServeStaticModule } from '@nestjs/serve-static';

//typeorm
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from './products/products.module';
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';
import { FilesModule } from './files/files.module';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { MessageWsModule } from './message-ws/message-ws.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [EnvConfig],
      validationSchema: envVarsSchema,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: EnvConfig().host,
      port: EnvConfig().portDb,
      database: EnvConfig().database,
      username: EnvConfig().username,
      password: EnvConfig().password,
      //the next lines are only for development purposes
      //delete them in production
      autoLoadEntities: true,
      synchronize: true,
    }),
    ProductsModule,
    CommonModule,
    SeedModule,
    FilesModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    AuthModule,
    MessageWsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
