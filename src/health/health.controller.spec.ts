import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';
import { PrismaService } from '../prisma/prisma.service';
import { TerminusModule } from '@nestjs/terminus';
import { Logger } from '@nestjs/common';

describe('HealthController', () => {
  let controller: HealthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TerminusModule.forRoot({
          logger: Logger,
          gracefulShutdownTimeoutMs: 1000,
        }),
      ],
      controllers: [HealthController],
      providers: [PrismaService],
    }).compile();

    controller = module.get<HealthController>(HealthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
