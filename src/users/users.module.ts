import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UsersMiddlewareConfig } from './middlewares/users.middleware.config';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    UsersMiddlewareConfig.configure(consumer);
  }
}
