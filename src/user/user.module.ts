import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from '../auth/auth.module';
import { RolesGuard } from '../auth/guards/roles.guard';
import { MiddlewareConfig } from '../auth/middleware/middleware.config';
import { User } from '../models/user.model';
import { UserController } from './controller/user.controller';
import { UserService } from './service/user.service';

@Module({
  imports: [AuthModule, SequelizeModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService, RolesGuard],
  exports: [UserService],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    MiddlewareConfig.configure(consumer);
  }
}
