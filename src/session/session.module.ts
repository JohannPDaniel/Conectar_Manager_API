import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Session } from '../auth/session.model';
import { SessionService } from './session.service';

@Module({
  imports: [SequelizeModule.forFeature([Session])],
  providers: [SessionService],
  exports: [SessionService],
})
export class SessionModule {}
