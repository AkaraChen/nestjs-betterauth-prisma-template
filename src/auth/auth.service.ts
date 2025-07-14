import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { username, organization, admin, apiKey } from 'better-auth/plugins';
import { Role } from '../../generated/prisma';
import { UserSession } from './types/auth.types';
import { toNodeHandler } from 'better-auth/node';

@Injectable()
export class AuthService {
  auth: ReturnType<typeof betterAuth>;
  handler: ReturnType<typeof toNodeHandler>;

  constructor(private readonly prismaService: PrismaService) {
    this.auth = betterAuth({
      database: prismaAdapter(this.prismaService, {
        provider: 'postgresql',
      }),
      plugins: [username(), admin(), organization(), apiKey()],
      emailAndPassword: {
        enabled: true,
        requireEmailVerification: false,
      },
    });
    this.handler = toNodeHandler(this.auth);
  }

  async hasRole(session: UserSession, role: Role[]) {
    const profile = await this.prismaService.profile.findUnique({
      where: {
        userId: session.user.id,
      },
    });
    if (!profile) {
      return false;
    }
    return role.includes(profile.role);
  }
}
