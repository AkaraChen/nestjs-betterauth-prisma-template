import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { username } from 'better-auth/plugins';

@Injectable()
export class AuthService {
  auth: ReturnType<typeof betterAuth>;
  constructor(private readonly prismaService: PrismaService) {
    this.auth = betterAuth({
      database: prismaAdapter(this.prismaService, {
        provider: 'postgresql',
      }),
      plugins: [username()],
    });
  }
}
