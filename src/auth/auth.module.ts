import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { DatabaseModule } from '../database/database.module';
import { SessionModule } from '../session/session.module';
import { Bcrypt, JWT } from '../utils';

import { JwtStrategy } from '../JWT/jwt.strategy';
import { AuthController } from './controllers/auth.controller';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { MiddlewareConfig } from './middleware/middleware.config';
import { AuthService } from './service/auth.service';

@Module({
  imports: [
    ConfigModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
    }),
    DatabaseModule,
    SessionModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JWT, Bcrypt, JwtAuthGuard, JwtStrategy],
  exports: [AuthService, JWT, Bcrypt, JwtAuthGuard],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    MiddlewareConfig.configure(consumer);
  }
}
