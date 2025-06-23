import { MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { UsersMiddleware } from './users.middleware';

export class UsersRoutes {
  static configureRoutes(consumer: MiddlewareConsumer) {
    consumer
      .apply(UsersMiddleware)
      .forRoutes({ path: 'users', method: RequestMethod.POST });
  }
}
