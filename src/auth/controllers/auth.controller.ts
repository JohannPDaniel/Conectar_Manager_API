import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ResponseAPI } from '../../types/responseApi';
import type { CreateUserDto, LoginDto } from '../dto';
import { AuthService } from '../service/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(201)
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
  @HttpCode(200)
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
