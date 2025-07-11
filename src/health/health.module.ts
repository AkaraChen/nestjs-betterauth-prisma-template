import { Logger, Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [
    TerminusModule.forRoot({
      logger: Logger,
      gracefulShutdownTimeoutMs: 1000,
    }),
  ],
  controllers: [HealthController],
  providers: [PrismaService],
})
export class HealthModule {}
