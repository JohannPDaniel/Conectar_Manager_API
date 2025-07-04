import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoginMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;
    const emailRegex = /^[^\s@]{3,}@[^\s@]{3,}\.com$/;

    if (!email) {
      res.status(400).json({
        success: false,
        message: 'O atributo (email) é obrigatório !!!',
      });
      return;
    }

    if (!password) {
      res.status(400).json({
        success: false,
        message: 'O atributo (senha) é obrigatório !!!',
      });
      return;
    }

    if (typeof email !== 'string') {
      res.status(400).json({
        success: false,
        message: 'O atributo (email) de vir em formato de texto !!!',
      });
      return;
    }

    if (typeof password !== 'string') {
      res.status(400).json({
        success: false,
        message: 'O atributo (senha) de vir em formato de texto !!!',
      });
      return false;
    }

    if (!emailRegex.test(email)) {
      res.status(400).json({
        success: false,
        message:
          'O e-mail informado deve estar em um formato de E-mail ****@****.com',
      });
      return false;
    }

    if (password.length < 4) {
      res.status(400).json({
        success: false,
        message: 'O atributo (senha) deve ter no mínimo 4 caracteres !!!',
      });
      return false;
    }
    return next();
  }
}
