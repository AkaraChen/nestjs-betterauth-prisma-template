import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from '../auth/auth.service';
import { ConfigService } from '@nestjs/config';
import { ADMIN_EMAIL, DEFAULT_ADMIN_PASSWORD } from './seeding.constants';

@Injectable()
export class SeedingService implements OnModuleInit {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    const userExists = await this.prismaService.user.findUnique({
      where: {
        email: ADMIN_EMAIL,
      },
    });
    if (!userExists) {
      const { user } = await this.authService.api.signUpEmail({
        body: {
          email: ADMIN_EMAIL,
          password:
            this.configService.get('ADMIN_PASSWORD') ?? DEFAULT_ADMIN_PASSWORD,
          name: 'admin',
        },
      });
      await this.prismaService.user.update({
        where: {
          id: user.id,
        },
        data: {
          role: 'admin',
        },
      });
    }
  }
}
