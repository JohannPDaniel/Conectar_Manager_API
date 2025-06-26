import { Inject, Injectable } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { CreateUserDto } from '../dto/createUser.dto';
import { User } from '../user.model';

@Injectable()
export class UsersService {
  constructor(@Inject('SEQUELIZE') private sequelize: Sequelize) {}
  public async create(data: CreateUserDto) {
    const user = await User.create(data);
    return {
      success: true,
      code: 201,
      message: 'Usuário criado com sucesso!',
      data: user,
    };
  }
}
