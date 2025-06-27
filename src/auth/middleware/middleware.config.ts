import { MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { AuthController } from '../controllers/auth.controller';
import { LoginMiddleware } from './login/login.middleware';
import { createUserMiddleware } from './register/createUser.middleware';

export class MiddlewareConfig {
  static configure(consumer: MiddlewareConsumer) {
    consumer.apply(createUserMiddleware).forRoutes(AuthController);

    consumer
      .apply(LoginMiddleware)
      .forRoutes({ path: 'auth/login', method: RequestMethod.POST });
  }
}
