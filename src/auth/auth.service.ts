import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { username } from 'better-auth/plugins';
import { Role } from '../../generated/prisma';
import { UserSession } from './types/auth.types';

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
