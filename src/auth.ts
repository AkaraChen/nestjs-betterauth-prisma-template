import { NestFactory } from '@nestjs/core';
import { AuthService } from './auth/auth.service';
import { AppModule } from './app.module';

// @ts-expect-error it's ok since this file is not used in the app
const app = await NestFactory.create(AppModule, {
  bufferLogs: true,
});
export const auth = app.get(AuthService).auth;
