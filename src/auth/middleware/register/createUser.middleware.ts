import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { UserRole } from '../../../types/userRoles';

@Injectable()
export class createUserMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const { name, email, password, role } = req.body;
    const emailRegex = /^[^\s@]{4,}@[^\s@]{3,}\.com$/;

    if (!name) {
      res.status(400).json({
        success: false,
        message: 'O atributo "name" é obrigatório!',
      });
      return;
    }

    if (!email) {
      res.status(400).json({
        success: false,
        message: 'O atributo "email" é obrigatório!',
      });
      return;
    }

    if (!password) {
      res.status(400).json({
        success: false,
        message: 'O atributo "password" é obrigatório!',
      });
      return;
    }

    if (!role) {
      res.status(400).json({
        success: false,
        message: 'O atributo "permissão" é obrigatório!',
      });
      return;
    }

    if (typeof name !== 'string') {
      res.status(400).json({
        success: false,
        message: 'O atributo "name" deve ser um texto!',
      });
      return;
    }

    if (typeof email !== 'string') {
      res.status(400).json({
        success: false,
        message: 'O atributo "email" deve ser um texto!',
      });
      return;
    }

    if (typeof password !== 'string') {
      res.status(400).json({
        success: false,
        message: 'O atributo "senha" deve ser um texto!',
      });
      return;
    }

    if (role !== UserRole.ADMIN && role !== UserRole.USER) {
      res.status(400).json({
        success: false,
        message: 'O atributo "permissão" deve ser do tipo (ADMIN) ou (USER)',
      });
      return;
    }

    if (name.length < 4) {
      res.status(400).json({
        success: false,
        message: 'O atributo "name" deve ter no mínimo 4 caracteres !!!',
      });
      return;
    }

    if (!emailRegex.test(email)) {
      res.status(400).json({
        success: false,
        message:
          'O e-mail informado deve estar em um formato de E-mail ****@****.com',
      });
      return;
    }

    if (password.length < 4) {
      res.status(400).json({
        success: false,
        message: 'O atributo "senha" ter no mínimo 4 caracteres!',
      });
      return;
    }

    return next();
  }
}
