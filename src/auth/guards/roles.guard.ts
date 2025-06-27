import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CustomRequest } from '../../types/customRequest';

export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) return true;

    const request = context.switchToHttp().getRequest<CustomRequest>();
    const user = request.user;

    if (!user || !requiredRoles.includes(user.role)) {
      return false;
    }

    return requiredRoles.includes(user.role); // Só passa se o role do usuário está nos permitidos
  }
}
