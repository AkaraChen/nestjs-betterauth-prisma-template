import { Controller, Get } from '@nestjs/common';
import {
  HealthCheckService,
  MemoryHealthIndicator,
  HealthCheck,
  PrismaHealthIndicator,
} from '@nestjs/terminus';
import { PrismaService } from '../prisma/prisma.service';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private memoryIndicator: MemoryHealthIndicator,
    private prismaIndicator: PrismaHealthIndicator,
    private prismaService: PrismaService,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.memoryIndicator.checkHeap('memory_heap', 150 * 1024 * 1024),
      () => this.prismaIndicator.pingCheck('prisma', this.prismaService),
    ]);
  }
}
