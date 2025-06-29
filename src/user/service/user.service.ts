import { Injectable } from '@nestjs/common';
import { AuthUser, UserDto } from '../../auth/dto';
import { User } from '../../auth/user.model';
import { ResponseAPI, UserRole } from '../../types';
import { UpdateUserDto } from '../dto/updateUser.dto';

@Injectable()
export class UserService {
  async findAll() {
    const users = await User.findAll();
    return {
      success: true,
      code: 200,
      message: 'Usuários encontrados com sucesso !!!',
      data: users.map((user) => this.mapToDto(user)),
    };
  }

  async findOne(id: string, currentUser: AuthUser): Promise<ResponseAPI> {
    const user = await User.findByPk(id);

    if (!user) {
      return {
        success: false,
        code: 404,
        message: 'Usuário não encontrado.',
      };
    }

    // Regra de negócio: só ADMIN ou o próprio usuário pode acessar
    if (currentUser.role !== UserRole.ADMIN && currentUser.id !== user.id) {
      return {
        success: false,
        code: 403,
        message: 'Você só pode visualizar seus próprios dados.',
      };
    }

    return {
      success: true,
      code: 200,
      message: 'Usuário encontrado pelo ID com sucesso !!!',
      data: this.mapToDto(user),
    };
  }

  async update(
    id: string,
    currentUser: AuthUser,
    data: UpdateUserDto,
  ): Promise<ResponseAPI> {
    const user = await User.findByPk(id);

    if (!user) {
      return {
        success: false,
        code: 404,
        message: 'Usuário não encontrado.',
      };
    }

    // Apenas admin ou o próprio usuário pode atualizar
    const isAdmin = currentUser.role === UserRole.ADMIN;
    const isSelf = currentUser.id === user.id;

    if (!isAdmin && !isSelf) {
      return {
        success: false,
        code: 403,
        message: 'Você só pode atualizar seus próprios dados.',
      };
    }

    // Se não for admin e tentar alterar o campo "role" → bloqueia
    if (!isAdmin && 'role' in data) {
      return {
        success: false,
        code: 403,
        message: 'Usuários regulares não podem alterar o campo "role".',
      };
    }

    // Se o usuário for admin e quiser se rebaixar para "user", permitimos
    // Se ele não for admin e mandar o role, vamos forçar para manter "user"
    if (!isAdmin) {
      delete data.role;
    }

    const updatedUser = await user.update(data);

    return {
      success: true,
      code: 200,
      message: 'Usuário atualizado com sucesso!',
      data: this.mapToDto(updatedUser),
    };
  }

  async remove(id: string): Promise<ResponseAPI> {
    const user = await User.findByPk(id);
    if (!user)
      return { success: false, code: 404, message: 'Usuário não encontrado' };

    const userDestroy = await user.destroy();
    return {
      success: true,
      code: 200,
      message: 'Usuário removido com sucesso',
      data: userDestroy,
    };
  }

  private mapToDto(user: User): UserDto {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
