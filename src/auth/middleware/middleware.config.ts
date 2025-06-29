import { MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { AuthMiddleware } from './login/auth.middleware';
import { LoginMiddleware } from './login/login.middleware';
import { createUserMiddleware } from './register/createUser.middleware';

export class MiddlewareConfig {
  static configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(createUserMiddleware)
      .forRoutes({ path: '/auth/register', method: RequestMethod.POST });

    consumer
      .apply(LoginMiddleware)
      .forRoutes({ path: '/auth/login', method: RequestMethod.POST });

    consumer
      .apply(AuthMiddleware)
      .forRoutes({ path: '/users/:id', method: RequestMethod.GET });

    consumer
      .apply(AuthMiddleware)
      .forRoutes({ path: '/users/:id', method: RequestMethod.PUT });
  }
}
