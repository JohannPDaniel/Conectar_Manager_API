import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './config/database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { MiddlewareConfig } from './modules/auth/middleware/middleware.config';
import { DebugModule } from './modules/debug/debug.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [DatabaseModule, AuthModule, DebugModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    MiddlewareConfig.configure(consumer);
  }
}
