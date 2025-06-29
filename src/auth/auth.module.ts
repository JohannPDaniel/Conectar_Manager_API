import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { SessionModule } from '../session/session.module';
import { Bcrypt, JWT } from '../utils';
import { AuthController } from './controllers/auth.controller';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { MiddlewareConfig } from './middleware/middleware.config';
import { AuthService } from './service/auth.service';

@Module({
  imports: [DatabaseModule, SessionModule],
  controllers: [AuthController],
  providers: [AuthService, JWT, JwtAuthGuard, Bcrypt],
  exports: [AuthService, JWT, JwtAuthGuard, Bcrypt],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    MiddlewareConfig.configure(consumer);
  }
}
