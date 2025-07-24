import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class GoogleTokenGuard implements CanActivate {
  private client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token de autenticação ausente.');
    }

    const token = authHeader.split(' ')[1];

    try {
      const ticket = await this.client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      request.user = payload; // ← Agora `req.user` está populado
      return true;
    } catch (err) {
      throw new UnauthorizedException('Token do Google inválido.');
    }
  }
}
