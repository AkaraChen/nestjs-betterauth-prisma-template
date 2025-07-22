import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from '../auth/auth.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SeedingService implements OnModuleInit {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly authService: AuthService,
        private readonly configService: ConfigService
    ) {}

    async onModuleInit() {
        const userExists = await this.prismaService.user.findUnique({
            where: {
                email: 'admin@admin.com'
            }
        })
        if (!userExists) {
            await this.authService.api.createUser({
                body: {
                    email: 'admin@admin.com',
                    password: this.configService.get('ADMIN_PASSWORD') ?? 'admin',
                    name: 'Admin',
                    role: 'admin',
                }
            })
        }
    }
}
