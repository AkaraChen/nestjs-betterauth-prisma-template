import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { username, organization, admin, apiKey } from 'better-auth/plugins';
import { UserSession } from './types/auth.types';
import { toNodeHandler } from 'better-auth/node';

function createAuth(prismaService: PrismaService) {
  return betterAuth({
    database: prismaAdapter(prismaService, {
      provider: 'postgresql',
    }),
    plugins: [username(), admin(), organization(), apiKey()],
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
    },
  });
}

@Injectable()
export class AuthService {
  auth: ReturnType<typeof createAuth>;
  api: ReturnType<typeof createAuth>['api'];
  handler: ReturnType<typeof toNodeHandler>;

  constructor(private readonly prismaService: PrismaService) {
    this.auth = createAuth(this.prismaService);
    this.api = this.auth.api;
    this.handler = toNodeHandler(this.auth);
  }
}
