import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { ResponseAPI } from '../../../config/types';
import { AuthUserGoogle } from '../../../config/types/authUserGoogle';
import { CreateUserDto, LoginDto } from '../dto';
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

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    // redireciona para o Google
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  public async googleAuthRedirect(
    @Req() req: Request & { user: AuthUserGoogle },
  ) {
    try {
      return await this.authService.loginGoogle(req.user);
    } catch (error: any) {
      return {
        success: false,
        code: 500,
        message: `Erro no servidor: ${error.message}`,
      };
    }
  }
}
