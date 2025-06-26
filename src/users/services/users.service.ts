import { Injectable } from '@nestjs/common';
import { Bcrypt } from '../../utils/bcrypt';
import { CreateUserDto } from '../dto/createUser.dto';
import { UserDto } from '../dto/user.dto';
import { User } from '../user.model';

@Injectable()
export class UsersService {
  constructor(private readonly bcrypt: Bcrypt) {}
  public async create(data: CreateUserDto) {
    const existingUser = await User.findOne({ where: { email: data.email } });

    if (existingUser) {
      return {
        success: false,
        code: 409,
        message: 'Este e-mail já está cadastrado.',
      };
    }

    const hashedPassword = await this.bcrypt.generateHash(data.password);

    const user = await User.create({
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: data.role,
    });

    return {
      success: true,
      code: 201,
      message: 'Usuário criado com sucesso!',
      data: this.mapToDto(user),
    };
  }

  private mapToDto(data: User): UserDto {
    return {
      id: data.id,
      name: data.name,
      email: data.email,
      role: data.role,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }
}
