import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Roles } from '../../auth/decorator/roles.decorator';
import { RolesGuard } from '../../auth/guards/roles.guard';
import {
  UserRole,
  type CustomRequest,
  type FindUsersQuery,
  type ResponseAPI,
} from '../../types';
import { UpdateUserDto } from '../dto/updateUser.dto';
import { UserService } from '../service/user.service';

@Controller('users')
@UseGuards(RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Roles(UserRole.ADMIN)
  async findAll(@Query() query: FindUsersQuery) {
    try {
      return await this.userService.findAll(query);
    } catch (error: any) {
      return {
        success: false,
        code: 500,
        message: `Erro no servidor: ${error.message}`,
      };
    }
  }

  @Get('inactive')
  @Roles(UserRole.ADMIN)
  async findInactive() {
    try {
      return await this.userService.findInactiveUsers();
    } catch (error: any) {
      return {
        success: false,
        code: 500,
        message: `Erro no servidor: ${error.message}`,
      };
    }
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Req() req: CustomRequest,
  ): Promise<ResponseAPI> {
    try {
      const user = req.user;
      return await this.userService.findOne(id, user);
    } catch (error: any) {
      return {
        success: false,
        code: 500,
        message: `Erro no servidor: ${error.message}`,
      };
    }
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Req() req: CustomRequest,
    @Body() body: UpdateUserDto,
  ) {
    try {
      const user = req.user;
      return await this.userService.update(id, user, body);
    } catch (error: any) {
      return {
        success: false,
        code: 500,
        message: `Erro no servidor: ${error.message}`,
      };
    }
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    try {
      return this.userService.remove(id);
    } catch (error: any) {
      return {
        success: false,
        code: 500,
        message: `Erro no servidor: ${error.message}`,
      };
    }
  }
}
