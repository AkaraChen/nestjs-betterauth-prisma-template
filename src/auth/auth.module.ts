import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { PrismaService } from '../prisma/prisma.service';
import { Reflector } from '@nestjs/core';

@Module({
  providers: [AuthService, ConfigService, PrismaService, Reflector],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
