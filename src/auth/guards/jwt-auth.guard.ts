import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CustomRequest } from '../../types/customRequest';
import { JWT } from '../../utils/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwt: JWT) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<CustomRequest>();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token não fornecido');
    }

    const token = authHeader.split(' ')[1];
    const user = this.jwt.verifyToken(token);

    if (!user) {
      throw new UnauthorizedException('Token inválido');
    }

    request.user = user; // Isso é crucial para o RolesGuard funcionar depois
    return true;
  }
}
