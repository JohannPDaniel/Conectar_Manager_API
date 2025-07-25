import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Request, Response } from 'express';
import type { ResponseAPI } from '../../../config/types';
import { AuthUserGoogle } from '../../../config/types/authUserGoogle';
import { CreateUserDto, LoginDto } from '../dto';
import { LogoutDto } from '../dto/logoutDto';
import { AuthService } from '../service/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  public async create(@Body() body: CreateUserDto): Promise<ResponseAPI> {
    try {
      return await this.authService.create(body);
    } catch (error: any) {
      return {
        success: false,
        code: 500,
        message: `Erro no servidor: ${error.message}`,
      };
    }
  }

  @Post('login')
  public async login(@Body() body: LoginDto) {
    try {
      return await this.authService.login(body);
    } catch (error: any) {
      return {
        success: false,
        code: 500,
        message: `Erro no servidor: ${error.message}`,
      };
    }
  }

  @Get('me')
  getMe(@Req() req: Request & { user: AuthUserGoogle }) {
    try {
      const user = req.user;

      return {
        success: true,
        message: 'Usuário autenticado com sucesso',
        data: user,
      };
    } catch (error: any) {
      return {
        success: false,
        code: 500,
        message: `Erro no servidor: ${error.message}`,
      };
    }
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    // redireciona para o Google
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  googleCallback(@Req() req: Request, @Res() res: Response) {
    const user = req.user as AuthUserGoogle;

    // Aqui você pode redirecionar para o frontend com os dados
    const redirectUrl = new URL('http://localhost:5173/logado');
    const data = {
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      accessToken: user.accessToken,
    };
    redirectUrl.searchParams.set('data', JSON.stringify(data));
    return res.redirect(redirectUrl.toString());
  }

  @Post('logout')
  public async logout(@Body() body: LogoutDto) {
    try {
      const { accessToken } = body;
      return await this.authService.revokeGoogleToken(accessToken);
    } catch (error: any) {
      return {
        success: false,
        code: 500,
        message: `Erro no servidor: ${error.message}`,
      };
    }
  }
}
