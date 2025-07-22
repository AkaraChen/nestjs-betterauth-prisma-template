import { Module } from '@nestjs/common';
import { SeedingService } from './seeding.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [SeedingService, PrismaService],
})
export class SeedingModule {}
