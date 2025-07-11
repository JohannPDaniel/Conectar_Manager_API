import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MiddlewareConfig } from './auth/middleware/middleware.config';
import { DatabaseModule } from './database/database.module';
import { DebugModule } from './debug/debug.module';
import { UserModule } from './user/user.module';

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
