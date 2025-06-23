import { MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { createUserMiddleware } from './createUser.middleware';

export class UsersMiddlewareConfig {
  static configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(createUserMiddleware)
      .forRoutes({ path: 'users', method: RequestMethod.POST });
  }
}
