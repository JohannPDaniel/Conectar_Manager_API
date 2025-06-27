import { Injectable } from '@nestjs/common';
import { UserRole } from '../../types/userRoles';
import { Bcrypt } from '../../utils/bcrypt';
import { JWT } from '../../utils/jwt';
import { CreateUserDto } from '../dto/createUser.dto';
import { LoginDto } from '../dto/loginDto';
import { UserDto } from '../dto/user.dto';
import { User } from '../user.model';
import { AuthUser } from '../dto/authUser';

@Injectable()
export class AuthService {
  constructor(
    private readonly bcrypt: Bcrypt,
    private readonly jwt: JWT,
  ) {}
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
      role: data.role ?? UserRole.USER,
    });

    return {
      success: true,
      code: 201,
      message: 'Usuário criado com sucesso!',
      data: this.mapToDto(user),
    };
  }

  public async login(data: LoginDto) {
    const user = await User.findOne({ where: { email: data.email } });

    if (!user) {
      return {
        success: false,
        code: 404,
        message: 'E-mail ou senha incorretos!',
      };
    }

    const hash = user.password;
    const isValidPassword = await this.bcrypt.verify(data.password, hash);

    if (!isValidPassword) {
      return {
        success: false,
        code: 404,
        message: 'E-mail ou senha inválidos!',
      };
    }

    const payload: AuthUser = {
      id: user.id,
      name: user.name,
      role: user.role,
    };

    const token = this.jwt.generateToken(payload);

    return {
      success: true,
      code: 200,
      message: 'Login efetuado com sucesso !!!',
      data: { token: token },
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
