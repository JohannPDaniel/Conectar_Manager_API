import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '../src/config/models/user.model';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'sqlite',
      storage: ':memory:',
      models: [User],
      autoLoadModels: true,
      synchronize: true,
      logging: false,
    }),
  ],
})
export class TestDatabaseModule {}
