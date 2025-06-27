import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { UserRole } from '../../../types/userRoles';

@Injectable()
export class createUserMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('🧩 Entrou no middleware de register');
    if (req.method === 'POST' && req.path === '/auth/register') {
      console.log('✅ Entrou no middleware /auth/register');
      // pode validar aqui normalmente
    }
    // if (!this.validateRequired(req, res)) return;
    // if (!this.validateTypes(req, res)) return;
    // if (!this.validateData(req, res)) return;

    return next();
  }

  private validateRequired(req: Request, res: Response): boolean {
    const { name, email, password, role } = req.body;

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

    if (!password) {
      res.status(400).json({
        success: false,
        message: 'O atributo "password" é obrigatório!',
      });
      return false;
    }

    if (!role) {
      res.status(400).json({
        success: false,
        message: 'O atributo "permissão" é obrigatório!',
      });
      return false;
    }
    return true;
  }

  private validateTypes(req: Request, res: Response): boolean | void {
    const { name, email, password, role } = req.body;

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

    if (typeof password !== 'string') {
      res.status(400).json({
        success: false,
        message: 'O atributo "senha" deve ser um texto!',
      });
      return false;
    }

    if (role !== UserRole.ADMIN && role !== UserRole.USER) {
      res.status(400).json({
        success: false,
        message: 'O atributo "permissão" deve ser do tipo (ADMIN) ou (USER)',
      });
      return false;
    }
  }

  private validateData(req: Request, res: Response): boolean | void {
    const { name, email, password } = req.body;

    if (name.length < 4) {
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

    if (password && password.length < 4) {
      res.status(400).json({
        success: false,
        message: 'O atributo "senha" ter no mínimo 4 caracteres!',
      });
      return false;
    }
    return true;
  }
}
