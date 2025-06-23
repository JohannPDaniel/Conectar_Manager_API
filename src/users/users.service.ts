import { Injectable } from '@nestjs/common';
import { createUser } from '../db/create-user.db';

@Injectable()
export class UsersService {
  create(data: { name: string; email: string }) {
    createUser.push(data);
    return {
      success: true,
      message: 'Usuário criado com sucesso!',
      data,
    };
  }
  findAll() {
    return {
      success: true,
      message: 'Usuarios buscados com sucesso!',
      data: createUser,
    };
  }
}
