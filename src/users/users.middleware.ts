import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class UsersMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (!this.validateRequired(req, res)) return;
    if (!this.validateTypes(req, res)) return;
    if (!this.validateData(req, res)) return;

    next();
  }

  private validateRequired(req: Request, res: Response): boolean {
    const { name, email } = req.body;

    if (!name) {
      res.status(400).json({
        success: false,
        message: 'O atributo "name" é obrigatório!',
      });
      return false;
    }

    if (!email) {
      res.status(400).json({
        success: false,
        message: 'O atributo "email" é obrigatório!',
      });
      return false;
    }

    return true;
  }

  private validateTypes(req: Request, res: Response): boolean {
    const { name, email } = req.body;

    if (typeof name !== 'string') {
      res.status(400).json({
        success: false,
        message: 'O atributo "name" deve ser um texto!',
      });
      return false;
    }

    if (typeof email !== 'string') {
      res.status(400).json({
        success: false,
        message: 'O atributo "email" deve ser um texto!',
      });
      return false;
    }

    return true;
  }

  private validateData(req: Request, res: Response): boolean {
    const { name, email } = req.body;

    if (name.lenght < 4) {
      res.status(400).json({
        success: false,
        message: 'O atributo "name" deve ter no mínimo 4 caracteres !!!',
      });
      return false;
    }

    const emailRegex = /^[^\s@]{3,}@[^\s@]{3,}\.com$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({
        success: false,
        message: 'O e-mail informado é inválido!',
      });
      return false;
    }

    return true;
  }
}
