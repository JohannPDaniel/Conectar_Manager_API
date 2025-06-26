import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { UsersController } from './controllers/users.controller';
import { UsersMiddlewareConfig } from './middlewares/users.middleware.config';
import { UsersService } from './services/users.service';

@Module({
  imports: [DatabaseModule], // <- IMPORTANTE
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], // ou exports: [SequelizeModule], se for reusar
})
export class UsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    UsersMiddlewareConfig.configure(consumer);
  }
}
