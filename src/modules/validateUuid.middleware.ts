import { NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { validate } from 'uuid';

export class ValidateUuidMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;

    if (!validate(id)) {
      res.status(400).json({
        success: false,
        message: 'Identificador precisa ser um UUID !',
      });
      return;
    }

    next();
  }
}
