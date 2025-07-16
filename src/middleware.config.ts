import { MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { AuthMiddleware } from './modules/auth/middleware/auth/auth.middleware';
import { LoginMiddleware } from './modules/auth/middleware/login/login.middleware';
import { createUserMiddleware } from './modules/auth/middleware/register/register.middleware';
import { FindAllMiddleware } from './modules/user/middleware/findAll/findAll.middleware';
import { UpdateMiddleware } from './modules/user/middleware/update/update.middleware';
import { ValidateUuidMiddleware } from './modules/validateUuid.middleware';

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

    //FindInactiveUsers - Visualizar usuários inativos
    consumer
      .apply(AuthMiddleware)
      .forRoutes({ path: '/users/inactive', method: RequestMethod.GET });

    // FindOne - Visualizar os próprios dados
    consumer
      .apply(AuthMiddleware, ValidateUuidMiddleware)
      .exclude({ path: '/users/inactive', method: RequestMethod.GET })
      .forRoutes({ path: '/users/:id', method: RequestMethod.GET });

    // Update - Atualizar os próprios dados
    consumer
      .apply(AuthMiddleware, ValidateUuidMiddleware, UpdateMiddleware)
      .forRoutes({ path: '/users/:id', method: RequestMethod.PUT });

    // Remove - Excluir usuário (apenas ADMIN no guard)
    consumer
      .apply(AuthMiddleware, ValidateUuidMiddleware)
      .forRoutes({ path: '/users/:id', method: RequestMethod.DELETE });
  }
}
