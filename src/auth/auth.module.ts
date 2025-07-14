import { Global, Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { HttpAdapterHost, Reflector } from '@nestjs/core';
import { SkipBodyParsingMiddleware } from './middlewares/body.middleware';

@Global()
@Module({
  providers: [AuthService, ConfigService, PrismaService, Reflector, Logger],
  exports: [AuthService],
})
export class AuthModule implements NestModule {
  constructor(
    private readonly authService: AuthService,
    private readonly adapter: HttpAdapterHost,
    private readonly logger: Logger,
  ) {}
  configure(consumer: MiddlewareConsumer) {
    this.adapter.httpAdapter.all('/api/auth/*splat', this.authService.handler);
    this.logger.log('better-auth http handler is on');
    consumer.apply(SkipBodyParsingMiddleware).forRoutes('*path');
  }
}
