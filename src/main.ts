import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { Logger } from 'pino-nestjs';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { setupGracefulShutdown } from 'nestjs-graceful-shutdown';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    bodyParser: false,
  });
  setupGracefulShutdown({ app });
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  const logger = app.get(Logger);
  app.useLogger(logger);
  const document = new DocumentBuilder().build();
  const config = app.get(ConfigService);
  const documentFactory = () => SwaggerModule.createDocument(app, document);
  SwaggerModule.setup('api', app, documentFactory, {
    jsonDocumentUrl: '/api/json',
  });
  app.enableCors({
    origin: config.getOrThrow<string>('ALLOWED_ORIGINS').split(','),
    credentials: true,
  });
  const port: number = config.get('PORT')!;
  logger.log(`Application is running on: http://localhost:${port}`);
  await app.listen(port);
}
void bootstrap();
