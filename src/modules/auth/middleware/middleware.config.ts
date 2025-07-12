import { MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { AuthMiddleware } from './login/auth.middleware';
import { LoginMiddleware } from './login/login.middleware';
import { createUserMiddleware } from './register/register.middleware';

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

    // Visualizar os próprios dados
    consumer
      .apply(AuthMiddleware)
      .forRoutes({ path: '/users/:id', method: RequestMethod.GET });

    // Atualizar os próprios dados
    consumer
      .apply(AuthMiddleware)
      .forRoutes({ path: '/users/:id', method: RequestMethod.PUT });

    // Excluir usuário (apenas ADMIN no guard)
    consumer
      .apply(AuthMiddleware)
      .forRoutes({ path: '/users/:id', method: RequestMethod.DELETE });

    // Listar todos os usuários (ADMIN no guard)
    consumer
      .apply(AuthMiddleware)
      .forRoutes({ path: '/users', method: RequestMethod.GET });
  }
}
