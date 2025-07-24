import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { User } from '@/config/models/user.model';
import { Bcrypt, JWT } from '@/config/utils';
import { MiddlewareConfig } from '@/middleware.config';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { GoogleStrategy } from '../../config/strategy/google.strategy';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './service/auth.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SequelizeModule.forFeature([User]),
  ],
  controllers: [AuthController],
  providers: [AuthService, JWT, Bcrypt, GoogleStrategy],
  exports: [JWT],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    MiddlewareConfig.configure(consumer);
  }
}
