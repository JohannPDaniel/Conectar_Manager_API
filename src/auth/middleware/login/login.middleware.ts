import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoginMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (!this.validateRequired(req, res)) return;
    if (!this.validateTypes(req, res)) return;
    if (!this.validateData(req, res)) return;

    next();
  }

  private validateRequired(req: Request, res: Response): boolean {
    const { email, password } = req.body;

    if (!email) {
      res.status(400).json({
        success: false,
        message: 'O atributo (email) é obrigatório !!!',
      });
      return false;
    }

    if (!password) {
      res.status(400).json({
        success: false,
        message: 'O atributo (senha) é obrigatório !!!',
      });
      return false;
    }

    return true;
  }

  private validateTypes(req: Request, res: Response): boolean {
    const { email, password } = req.body;

    if (typeof email !== 'string') {
      res.status(400).json({
        success: false,
        message: 'O atributo (email) de vir em formato de texto !!!',
      });
      return false;
    }

    if (typeof password !== 'string') {
      res.status(400).json({
        success: false,
        message: 'O atributo (senha) de vir em formato de texto !!!',
      });
      return false;
    }

    return true;
  }
  private validateData(req: Request, res: Response): boolean {
    const { email, password } = req.body;

    const emailRegex = /^[^\s@]{3,}@[^\s@]{3,}\.com$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({
        success: false,
        message:
          'O e-mail informado deve estar em um formato de E-mail ****@****.com',
      });
      return false;
    }

    if (typeof password !== 'string') {
      res.status(400).json({
        success: false,
        message: 'O atributo (senha) de vir em formato de texto !!!',
      });
      return false;
    }

    return true;
  }
}
