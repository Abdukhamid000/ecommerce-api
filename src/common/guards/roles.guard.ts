import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../../database/db.js';
import { ROLES_KEY } from '../decorators.js';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(ctx: ExecutionContext) {
    const requiredRole = this.reflector.getAllAndOverride<Role>(ROLES_KEY, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);

    if (!requiredRole) return true;
    const { user } = ctx.switchToHttp().getRequest();

    if (!requiredRole.includes(user?.role))
      throw new UnauthorizedException('U cannot access');

    return true;
  }
}
