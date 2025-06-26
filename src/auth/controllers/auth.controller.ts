import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { LoginDto } from '../dto/loginDto';
import { AuthService } from '../service/auth.service';

@Controller('auth/login')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  @HttpCode(200)
  public async login(@Body() body: LoginDto) {
    try {
      return this.authService.login(body);
    } catch (error: any) {
      return {
        success: false,
        code: 500,
        message: `Erro no servidor: ${error.message}`,
      };
    }
  }
}
