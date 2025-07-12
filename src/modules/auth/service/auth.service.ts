import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../../../config/models/user.model';
import { UserRole } from '../../../types';
import { Bcrypt, JWT } from '../../../utils';
import { AuthUser, CreateUserDto, LoginDto, UserDto } from '../dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
    private readonly bcrypt: Bcrypt,
    private readonly jwt: JWT,
  ) {}
  public async create(data: CreateUserDto) {
    const existingUser = await this.userModel.findOne({
      where: { email: data.email },
    });

    if (existingUser) {
      return {
        success: false,
        code: 409,
        message: 'Este e-mail já está cadastrado.',
      };
    }

    const hashedPassword = await this.bcrypt.generateHash(data.password);

    const user = await this.userModel.create({
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
    const user = await this.userModel.findOne({ where: { email: data.email } });

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

    user.lastLogin = new Date();
    await user.save();

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
      lastLogin: data.lastLogin,
    };
  }
}
