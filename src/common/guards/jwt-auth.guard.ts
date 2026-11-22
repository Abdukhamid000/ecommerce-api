import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { IS_PUBLIC_KEY } from '../decorators.js';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private logger = new Logger(JwtAuthGuard.name);
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}
  async canActivate(ctx: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const req = ctx.switchToHttp().getRequest();

    const [type, token] = req.headers.authorization?.split(' ') ?? [];

    if (type !== 'Bearer' || !token)
      throw new UnauthorizedException('invalid or expired token');

    try {
      const user = await this.jwtService.verifyAsync(token);
      req.user = user;
    } catch (e) {
      this.logger.debug(e);
      throw new UnauthorizedException('invalid or expired token');
    }

    return true;
  }
}
