import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import type { $Enums, Profile } from '../../../generated/prisma';

export class ProfileVo implements Profile {
  @Exclude()
  role: $Enums.Role;

  @Exclude()
  id: string;

  @ApiProperty({ description: 'The ID of the user this profile belongs to' })
  userId: string;

  @ApiProperty({
    description: 'The biography of the user',
    required: false,
    nullable: true,
    type: 'string',
  })
  bio: string | null;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;
}
