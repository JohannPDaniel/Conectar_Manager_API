import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { RolesGuard } from '../auth/guards/roles.guard';
import { MiddlewareConfig } from '../auth/middleware/middleware.config';
import { JwtModule } from '../JWT/jwt.module';
import { UserController } from './controller/user.controller';
import { UserService } from './service/user.service';

@Module({
  imports: [JwtModule],
  controllers: [UserController],
  providers: [UserService, RolesGuard],
  exports: [UserService],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    MiddlewareConfig.configure(consumer);
  }
}
