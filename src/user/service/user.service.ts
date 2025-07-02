import { Injectable } from '@nestjs/common';
import { Op } from 'sequelize';
import { AuthUser, UserDto } from '../../auth/dto';
import { User } from '../../models/user.model';
import { FindUsersQuery, ResponseAPI, UserRole } from '../../types';
import { UpdateUserDto } from '../dto/updateUser.dto';

@Injectable()
export class UserService {
  async findAll({
    role,
    sortBy,
    order,
    name,
  }: FindUsersQuery): Promise<ResponseAPI> {
    const where: any = {};

    // 🔒 Filtro por role (com tratamento de aspas)
    if (role) {
      const normalizedRole = String(role)
        .trim()
        .replace(/^"+|"+$/g, '');

      const validRoles = ['admin', 'user'];

      if (!validRoles.includes(normalizedRole)) {
        return {
          success: false,
          code: 400,
          message: `Valor de role inválido: "${normalizedRole}". Use (admin) ou (user).`,
        };
      }

      where.role = normalizedRole;
    }

    // 🔍 Filtro por nome parcial (case-insensitive)
    if (name) {
      where.name = { [Op.iLike]: `%${name}%` };
    }

    // 🔃 Ordenação dinâmica
    const allowedSortFields = ['name', 'createdAt'];
    const validSortBy = allowedSortFields.includes(sortBy || '')
      ? sortBy
      : 'createdAt';
    const validOrder = order?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    if (sortBy && !allowedSortFields.includes(sortBy)) {
      return {
        success: false,
        code: 400,
        message: `Campo de ordenação inválido: "${sortBy}". Use "name" ou "createdAt".`,
      };
    }

    const users = await User.findAll({
      where,
      order: [[validSortBy as string, validOrder as string]],
    });

    return {
      success: true,
      code: 200,
      message: 'Usuários encontrados com sucesso!',
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

  async findInactiveUsers(): Promise<ResponseAPI> {
    const THIRTY_DAYS_AGO = new Date();
    THIRTY_DAYS_AGO.setDate(THIRTY_DAYS_AGO.getDate() - 30);

    const users = await User.findAll({
      where: {
        lastLogin: {
          [Op.or]: [
            { [Op.lt]: THIRTY_DAYS_AGO },
            { [Op.is]: null }, // nunca logaram
          ],
        },
      },
    });

    return {
      success: true,
      code: 200,
      message: 'Usuários inativos listados com sucesso!',
      data: users.map((user) => this.mapToDto(user)),
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

    const isAdmin = currentUser.role === UserRole.ADMIN;
    const isSelf = currentUser.id === user.id;

    if (!isAdmin && !isSelf) {
      return {
        success: false,
        code: 403,
        message: 'Você só pode atualizar seus próprios dados.',
      };
    }

    // 🚫 Impede user comum de atualizar o campo role se ele estiver presente e definido
    if (!isAdmin && data.role !== undefined) {
      return {
        success: false,
        code: 403,
        message: 'Usuários regulares não podem alterar o campo (role).',
      };
    }

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

    await user.destroy();
    return {
      success: true,
      code: 200,
      message: 'Usuário removido com sucesso',
      data: this.mapToDto(user),
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
      lastLogin: user.lastLogin,
    };
  }
}
