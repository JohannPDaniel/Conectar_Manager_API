import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { CustomRequest } from '../../../../types';
import { JWT } from '../../../../utils';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly jwt: JWT) {}
  use(req: CustomRequest, res: Response, next: NextFunction) {
    const authorization = req.headers.authorization;

    if (!authorization) {
      res.status(401).json({
        success: false,
        message: 'Token não autenticado',
      });
      return;
    }

    const parts = authorization.split(' ');

    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      res.status(401).json({
        success: false,
        message: 'Formato do token inválido! Use (Bearer <token>).',
      });
      return;
    }

    const token = parts[1];

    const userDecode = this.jwt.verifyToken(token);

    if (!userDecode) {
      res.status(401).json({
        success: false,
        message: 'Usuário não autenticado!',
      });
      return;
    }

    req.user = {
      id: userDecode.id,
      name: userDecode.name,
      role: userDecode.role,
    };

    next();
  }
}
