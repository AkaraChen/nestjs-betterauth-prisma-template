import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { LoggerModule } from 'pino-nestjs';
import { TransportTargetOptions } from 'pino';
import { HealthModule } from './health/health.module';
import { AuthModule } from './auth/auth.module';
import { ProfilesModule } from './profiles/profiles.module';
import { PrismaModule } from './prisma/prisma.module';
import { GracefulShutdownModule } from 'nestjs-graceful-shutdown';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.local'],
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string().required(),
        NODE_ENV: Joi.string().default('development'),
        PORT: Joi.number().default(4000),
        BETTER_AUTH_SECRET: Joi.string().required(),
      }),
    }),
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory(config: ConfigService) {
        const targets: TransportTargetOptions[] = [
          {
            target: 'pino/file',
            options: { destination: 'app.log', mkdir: true },
            level: 'info',
          },
        ];
        if (config.get('NODE_ENV') === 'development') {
          targets.push({
            target: 'pino-pretty',
            options: {
              colorize: true,
              singleLine: true,
            },
            level: 'info',
          });
        } else {
          // to stdout without pretty
          targets.push({
            target: 'pino',
            options: {
              colorize: true,
              singleLine: true,
            },
            level: 'info',
          });
        }
        return {
          pinoHttp: {
            transport: {
              targets,
            },
          },
        };
      },
    }),
    HealthModule,
    AuthModule,
    ProfilesModule,
    PrismaModule,
    GracefulShutdownModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
