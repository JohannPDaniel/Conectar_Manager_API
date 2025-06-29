import { MiddlewareConsumer, NestModule, RequestMethod } from '@nestjs/common';
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
  }
}
