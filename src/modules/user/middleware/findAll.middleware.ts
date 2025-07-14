import { CustomRequest, UserRole } from '@/config/types';
import { NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';

export class FindAllMiddleware implements NestMiddleware {
  use(req: CustomRequest, res: Response, next: NextFunction) {
    const { role, sortBy, order, name } = req.query;
    const userRole = req.user.role;

    if (userRole === UserRole.ADMIN) {
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
