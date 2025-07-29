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

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authService: AuthService,
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
      throw new UnauthorizedException({
        message: 'Session not found',
      });
    }

    request.session = session;

    const roles = this.reflector.get(Roles, context.getHandler());

    if (roles?.length && roles.length > 0) {
      const user = session.user;

      if (!user) {
        throw new UnauthorizedException({
          message: 'User not found',
        });
      }
      if (!user.role) {
        throw new UnauthorizedException({
          message: 'User role not found',
        });
      }
      const userRoles = user.role.split(',');
      if (userRoles.length === 0) {
        throw new UnauthorizedException({
          message: 'User role not found',
        });
      }
      return roles.some((role) => userRoles.includes(role));
    }

    return true;
  }
}
