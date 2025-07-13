import { Body, Controller, Post } from '@nestjs/common';
import { ResponseAPI } from '@/config/types';
import type { CreateUserDto, LoginDto } from '../dto';
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
}
