import { applyDecorators } from '@nestjs/common';
import { Role } from '../../../generated/prisma';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ApiUnauthorizedResponse } from '@nestjs/swagger';
import { Roles } from './role.decorator';

export function Auth(...roles: Role[]) {
  return applyDecorators(
    UseGuards(AuthGuard),
    Roles(roles),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  );
}
