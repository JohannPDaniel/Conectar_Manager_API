import { NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

export class UpdateMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const { name, email, password } = req.body;
    const emailRegex = /^[^\s@]{3,}@[^\s@]{3,}\.com$/;

    if (name && typeof name !== 'string') {
      res.status(400).json({
        success: false,
        message: 'O atributo nome deve vir em formato de texto !!!',
      });
      return;
    }

    if (email && !emailRegex.test(email)) {
      res.status(400).json({
        success: false,
        message:
          'O atributo e-mail deve vir em formato de e-mail: ****@****.com !!!',
      });
      return;
    }

    if (password && typeof password !== 'string') {
      res.status(400).json({
        success: false,
        message: 'O atributo senha deve vir em formato de texto !!!',
      });
      return;
    }

    if (name && name.length < 4) {
      res.status(400).json({
        success: false,
        message: 'O atributo nome deve ter no minimo 4 caracteres !!!',
      });
      return;
    }

    if (password && password.length < 4) {
      res.status(400).json({
        success: false,
        message: 'O atributo senha deve ter no minimo 4 caracteres !!!',
      });
      return;
    }

    next();
  }
}
