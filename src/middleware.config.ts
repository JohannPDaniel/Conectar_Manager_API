import { MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { AuthMiddleware } from './modules/auth/middleware/login/auth.middleware';
import { LoginMiddleware } from './modules/auth/middleware/login/login.middleware';
import { createUserMiddleware } from './modules/auth/middleware/register/register.middleware';
import { FindAllMiddleware } from './modules/user/middleware/findAll.middleware';

export class MiddlewareConfig {
  static configure(consumer: MiddlewareConsumer) {
    // Registro
    consumer
      .apply(createUserMiddleware)
      .forRoutes({ path: '/auth/register', method: RequestMethod.POST });

    // Login
    consumer
      .apply(LoginMiddleware)
      .forRoutes({ path: '/auth/login', method: RequestMethod.POST });

    // FindAll - Visualizar todos os dados
    consumer
      .apply(AuthMiddleware, FindAllMiddleware)
      .forRoutes({ path: '/users', method: RequestMethod.GET });

    // FindOne - Visualizar os próprios dados
    consumer
      .apply(AuthMiddleware)
      .forRoutes({ path: '/users/:id', method: RequestMethod.GET });

    // Update - Atualizar os próprios dados
    consumer
      .apply(AuthMiddleware)
      .forRoutes({ path: '/users/:id', method: RequestMethod.PUT });

    // Remove - Excluir usuário (apenas ADMIN no guard)
    consumer
      .apply(AuthMiddleware)
      .forRoutes({ path: '/users/:id', method: RequestMethod.DELETE });
  }
}
