import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { MiddlewareConfig } from '../auth/middleware/middleware.config';
import { JwtModule } from '../JWT/jwt.module';
import { UserController } from './controller/user.controller';
import { UserService } from './service/user.service';

@Module({
  imports: [JwtModule],
  controllers: [UserController],
  providers: [UserService, JwtAuthGuard, RolesGuard],
  exports: [UserService],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    MiddlewareConfig.configure(consumer);
  }
}
