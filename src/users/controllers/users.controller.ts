import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { UsersService } from '../services/users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  @HttpCode(201)
  public create(
    @Body() body: { name: string; email: string; password: string },
  ) {
    return this.userService.create(body);
  }

  @Get()
  public findAll() {
    return this.userService.findAll();
  }
}
