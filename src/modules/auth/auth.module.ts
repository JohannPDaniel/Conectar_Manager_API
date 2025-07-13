import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '@/config/models/user.model';
import { Bcrypt, JWT } from '@/config/utils';
import { MiddlewareConfig } from '@/middleware.config';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './service/auth.service';

@Module({
  imports: [SequelizeModule.forFeature([User])],
  controllers: [AuthController],
  providers: [AuthService, JWT, Bcrypt],
  exports: [JWT],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    MiddlewareConfig.configure(consumer);
  }
}
