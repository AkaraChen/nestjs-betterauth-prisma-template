import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfilesService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(userId: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    return profile;
  }

  async upsert(userId: string, updateProfileDto: UpdateProfileDto) {
    const { bio } = updateProfileDto;
    return this.prisma.profile.upsert({
      where: { userId },
      update: {
        bio,
      },
      create: {
        userId,
        bio,
        role: 'USER',
      },
    });
  }
}
