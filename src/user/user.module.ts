import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { MiddlewareConfig } from '../auth/middleware/middleware.config';
import { JwtModule } from '../JWT/jwt.module';
import { SessionModule } from '../session/session.module';
import { UserController } from './controller/user.controller';
import { UserService } from './service/user.service';

@Module({
  imports: [JwtModule, SessionModule],
  controllers: [UserController],
  providers: [UserService, JwtAuthGuard, RolesGuard],
  exports: [UserService],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    MiddlewareConfig.configure(consumer);
  }
}
