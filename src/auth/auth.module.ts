import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { Bcrypt, JWT } from '../utils';
import { AuthController } from './controllers/auth.controller';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthService } from './service/auth.service';

@Module({
  imports: [DatabaseModule],
  controllers: [AuthController],
  providers: [AuthService, JWT, JwtAuthGuard, Bcrypt],
  exports: [AuthService, JWT, JwtAuthGuard, Bcrypt],
})
export class AuthModule {}
