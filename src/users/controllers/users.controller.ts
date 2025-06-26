import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { User } from '../user.model';

@Controller('auth/register')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  @HttpCode(201)
  public async create(@Body() body: User) {
    try {
      return await this.userService.create(body);
    } catch (error: any) {
      return {
        success: false,
        code: 500,
        message: `Erro no servidor: ${error.message}`,
      };
    }
  }
}
