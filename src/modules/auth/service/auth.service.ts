import { User } from '@/config/models/user.model';
import { UserRole } from '@/config/types';
import { Bcrypt, JWT } from '@/config/utils';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { google } from 'googleapis';
import { AuthUserGoogle } from '../../../config/types/authUserGoogle';
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

  public async loginGoogle(data: AuthUserGoogle) {
    const existingUser = await this.userModel.findOne({
      where: { email: data.email },
    });

    if (!existingUser) {
      const createUser = await this.userModel.create({
        email: data.email,
        name: data.name,
        password: data.password ?? '',
        role: data.role,
      });

      createUser.lastLogin = new Date();
      await createUser.save();

      return {
        success: true,
        code: 201,
        message: 'Usuário criado automaticamente via Google',
        data: {
          ...createUser.get(),
          accessToken: data.accessToken,
        },
      };
    }

    // <-- Adiciona isso aqui!
    existingUser.lastLogin = new Date();
    await existingUser.save();

    return {
      success: true,
      code: 200,
      message: 'Login com Google realizado com sucesso',
      data: {
        ...existingUser.get(),
        accessToken: data.accessToken,
      },
    };
  }

  public async revokeGoogleToken(accessToken: string) {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
    );

    const response = await oauth2Client.revokeToken(accessToken);

    if (!response?.status || response?.status !== 200) {
      return {
        success: false,
        code: 404,
        message: 'Falha ao revogar o token',
      };
    }

    return {
      success: true,
      code: 200,
      message: 'Token revogado com sucesso (googleapis)',
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
