import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { createUser } from '../../db/create-user.db';
import { Bcrypt } from '../../utils/bcrypt';

@Injectable()
export class UsersService {
  public async create(data: { name: string; email: string; password: string }) {
    const index = createUser.findIndex((e) => e.email === data.email);

    if (index !== -1) {
      return {
        success: false,
        code: 409,
        message: 'Email já está em uso, escolha outro !!!',
      };
    }

    const bcrypt = new Bcrypt();
    const passwordHash = await bcrypt.generateHash(data.password);

    const createDataUser = {
      id: randomUUID(),
      name: data.name,
      email: data.email,
      password: passwordHash,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    createUser.push(createDataUser);

    return {
      success: true,
      code: 201,
      message: 'Usuário criado com sucesso!',
      data,
    };
  }

  public findAll() {
    return {
      success: true,
      message: 'Usuarios buscados com sucesso!',
      data: createUser,
    };
  }
}
