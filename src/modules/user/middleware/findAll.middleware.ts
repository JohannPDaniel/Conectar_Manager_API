import { NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { CustomRequest, UserRole } from '../../../config/types';

export class FindAllMiddleware implements NestMiddleware {
  use(req: CustomRequest, res: Response, next: NextFunction) {
    const { role, sortBy, order, name } = req.query;
    const userRole = req.user.role as UserRole;

    if (userRole === UserRole.ADMIN) {
      if (role && typeof role !== 'string') {
        res.status(400).json({
          success: false,
          message: 'A permissão deve vir em formato de texto !!!',
        });
        return;
      }

      if (sortBy && typeof sortBy !== 'string') {
        res.status(400).json({
          success: false,
          message: 'A forma de organização deve vir em formato de texto !!!',
        });
        return;
      }

      if (order && typeof order !== 'string') {
        res.status(400).json({
          success: false,
          message: 'A ordem deve vir em formato de texto !!!',
        });
        return;
      }

      if (name && typeof name !== 'string') {
        res.status(400).json({
          success: false,
          message: 'O nome deve vir em formato de texto !!!',
        });
        return;
      }

      if (role && !['admin', 'user'].includes(role)) {
        res.status(400).json({
          success: false,
          message: 'A permissão deve ser obrigatóriamente ou (admin) ou (user)',
        });
        return;
      }

      if (sortBy && !['name', 'createdAt'].includes(sortBy)) {
        res.status(400).json({
          success: false,
          message:
            'A forma de organização deve ser ou por (name) ou por (createdAt)',
        });
        return;
      }

      if (order && !['ASC', 'DESC'].includes(order)) {
        res.status(400).json({
          success: false,
          message: 'A ordem deve ser ou (ASC) ou (DESC)',
        });
        return;
      }
    }

    next();
  }
}
