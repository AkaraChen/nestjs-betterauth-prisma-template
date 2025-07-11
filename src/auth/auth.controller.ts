import { All, Controller, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { toNodeHandler } from 'better-auth/node';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  private handler: ReturnType<typeof toNodeHandler>;

  constructor(private readonly authService: AuthService) {
    this.handler = toNodeHandler(this.authService.auth);
  }

  @All('{*any}')
  handle(@Req() req: Request, @Res() res: Response) {
    return this.handler(req, res);
  }
}
