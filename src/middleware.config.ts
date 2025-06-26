import { MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { AuthMiddleware } from './auth/middleware/auth.middleware';
import { LoginMiddleware } from './auth/middleware/login.middleware';
import { createUserMiddleware } from './users/middlewares/createUser.middleware';

export class MiddlewareConfig {
  static configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(createUserMiddleware)
      .forRoutes({ path: 'auth/register', method: RequestMethod.POST });

    consumer
      .apply(LoginMiddleware)
      .forRoutes({ path: 'auth/login', method: RequestMethod.POST });

    // consumer
    //   .apply(AuthMiddleware)
    //   .forRoutes({ path: 'auth/login', method: RequestMethod.POST });
  }
}
