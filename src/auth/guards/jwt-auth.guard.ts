import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SessionService } from '../../session/session.service';
import { CustomRequest } from '../../types';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly sessionService: SessionService) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const req = context.switchToHttp().getRequest<CustomRequest>();
      const can = await super.canActivate(context);
      if (!can) return false;

      const authHeader = req.headers.authorization;
      const token =
        typeof authHeader === 'string' ? authHeader.split(' ')[1] : null;
      if (!token) return false;

      const sessionExists = await this.sessionService.isTokenValid(
        req.user.id,
        token,
      );

      if (!sessionExists) {
        throw new UnauthorizedException('Sessão inválida ou expirada');
      }

      return true;
    } catch (error: any) {
      console.error('Erro no JwtAuthGuard:', error.message); // 👈 isso aqui vai revelar o problema real
      throw new UnauthorizedException('Erro na autenticação');
    }
  }
}
