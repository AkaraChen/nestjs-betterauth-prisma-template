import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { fromNodeHeaders } from 'better-auth/node';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { AuthService } from '../auth.service';
import { RequestWithSession } from '../types/auth.types';
import { Roles } from '../decorators/role.decorator';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authService: AuthService,
    private readonly prismaService: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request: RequestWithSession = context.switchToHttp().getRequest();
    const session = await this.authService.auth.api.getSession({
      headers: fromNodeHeaders(request.headers),
    });

    if (!session) {
      throw new UnauthorizedException();
    }

    request.session = session;

    const roles = this.reflector.get(Roles, context.getHandler());

    if (roles?.length && roles.length > 0) {
      const user = await this.prismaService.user.findUnique({
        where: {
          id: session.user.id,
        },
      });

      if (!user || !user.role) {
        throw new UnauthorizedException();
      }
      // @ts-expect-error
      if (!roles.includes(user.role.split(','))) {
        throw new UnauthorizedException();
      }
    }

    return true;
  }
}
