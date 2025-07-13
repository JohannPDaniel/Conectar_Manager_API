import { UserMock } from '@/config/mock/user.mock';
import { User } from '@/config/models/user.model';
import { UserRole } from '@/config/types';
import { JWT } from '@/config/utils';
import { getModelToken } from '@nestjs/sequelize';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthUser } from '../../auth/dto';
import { UpdateUserDto } from '../dto/updateUser.dto';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;

  const sequelizeMock = {
    findAll: jest.fn(),
    findInactiveUsers: jest.fn(),
    findByPk: jest.fn(),
  };

  const user = {
    ...UserMock.build(),
    order: 'asc' as 'asc' | 'desc',
    sortBy: 'name' as 'name' | 'createdAt',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [JWT],
      providers: [
        UserService,
        {
          provide: getModelToken(User),
          useValue: sequelizeMock,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('FINDALL - Deve retornar 400 se a permissão for diferente de (admin) ou (user)', async () => {
    sequelizeMock.findAll.mockResolvedValue([]);

    const result = await service.findAll({
      name: user.name,
      order: user.order,
      role: 'ad',
      sortBy: user.sortBy,
    });

    expect(result.code).toBe(400);
    expect(result.success).toBeFalsy();
    expect(result.message).toMatch(/admin.*user/i);
  });

  it('FINDALL - Deve retornar 400 se o campo de pesquisa por sortBy não for (name) ou (createdAt)', async () => {
    sequelizeMock.findAll.mockResolvedValue([]);

    const result = await service.findAll({
      name: user.name,
      order: user.order,
      role: user.role,
      sortBy: 'ad' as any,
    });

    expect(result.code).toBe(400);
    expect(result.success).toBeFalsy();
    expect(result.message).toMatch(/name.*createdAt/i);
  });

  it('FINDALL - Deve retornar 200 quando for informado um consulta válida', async () => {
    sequelizeMock.findAll.mockResolvedValue([]);

    const result = await service.findAll({
      name: user.name,
      order: user.order,
      role: user.role,
      sortBy: user.sortBy,
    });

    expect(result.code).toBe(200);
    expect(result.success).toBeTruthy();
    expect(result.message).toMatch(/Usuários.*sucesso/i);
  });

  it('FINDINACTIVEUSERS - Deve retornar 200 quando consultado os usuário inativos', async () => {
    sequelizeMock.findInactiveUsers.mockResolvedValue([]);

    const result = await service.findInactiveUsers();

    expect(result.code).toBe(200);
    expect(result.success).toBeTruthy();
    expect(result.message).toMatch(/Usuários.*sucesso/i);
  });

  it('FINDONE - Deve retornar 404 quando não for informado um usuário.', async () => {
    sequelizeMock.findByPk.mockResolvedValue(null);

    const result = await service.findOne(user.id, {
      id: user.id,
      name: user.name,
      role: user.role,
    });

    expect(result.code).toBe(404);
    expect(result.success).toBeFalsy();
    expect(result.message).toMatch(/Usuário.*encontrado/i);
  });

  it('FINDONE - Deve retornar 403 se um usuário do tipo (user) tentar ver a informação de outro usuário.', async () => {
    sequelizeMock.findByPk.mockResolvedValue(user);

    const result = await service.findOne(user.id, {
      id: 'id-diferente',
      name: user.name,
      role: user.role,
    });

    expect(result.code).toBe(403);
    expect(result.success).toBeFalsy();
    expect(result.message).toBe('Você só pode visualizar seus próprios dados.');
  });

  it('FINDONE - Deve retornar 200 quando for informado um id de usuário válido', async () => {
    sequelizeMock.findByPk.mockResolvedValue(user);

    const result = await service.findOne(user.id, {
      id: user.id,
      name: user.name,
      role: user.role,
    });

    expect(result.code).toBe(200);
    expect(result.success).toBeTruthy();
    expect(result.message).toMatch(/Usuário.*sucesso/i);
  });

  it('UPDATE - Deve retornar 404 quando não for encontrado um usuário', async () => {
    sequelizeMock.findByPk.mockResolvedValue(null);

    const currentUser: AuthUser = {
      id: user.id,
      name: user.name,
      role: user.role,
    };

    const data: Partial<UpdateUserDto> = {
      role: UserRole.USER,
    };

    const result = await service.update(user.id, currentUser, data);

    expect(result.code).toBe(404);
    expect(result.success).toBeFalsy();
    expect(result.message).toMatch(/Usuário.*encontrado/i);
  });

  it('UPDATE - Deve retornar 403 quando um usuário do tipo (user) tentar atualizar dados de outra pessoa', async () => {
    sequelizeMock.findByPk.mockResolvedValue({
      ...user,
      update: jest.fn(),
    });

    const currentUser: AuthUser = {
      id: 'id-diferente',
      name: user.name,
      role: user.role,
    };

    const data: Partial<UpdateUserDto> = {
      role: UserRole.USER,
    };

    const result = await service.update(user.id, currentUser, data);

    expect(result.code).toBe(403);
    expect(result.success).toBeFalsy();
    expect(result.message).toMatch(
      'Você só pode atualizar seus próprios dados.',
    );
  });

  it('UPDATE - Deve retornar 403 quando um usuário do tipo (user) tentar atualizar o seu role para (admin)', async () => {
    sequelizeMock.findByPk.mockResolvedValue({
      ...user,
      update: jest.fn(),
    });

    const currentUser: AuthUser = {
      id: user.id,
      name: user.name,
      role: user.role,
    };

    const data: Partial<UpdateUserDto> = {
      role: UserRole.ADMIN,
    };

    const result = await service.update(user.id, currentUser, data);

    expect(result.code).toBe(403);
    expect(result.success).toBeFalsy();
    expect(result.message).toMatch(
      'Usuários regulares não podem alterar o campo (role).',
    );
  });

  it('UPDATE - Deve retornar um usuário atualizado quando fornecido um Body válido', async () => {
    sequelizeMock.findByPk.mockResolvedValue({
      ...user,
      update: jest.fn().mockResolvedValue({
        ...user,
        name: 'Johann',
      }),
    });

    const currentUser: AuthUser = {
      id: user.id,
      name: user.name,
      role: user.role,
    };

    const data: Partial<UpdateUserDto> = {
      name: 'Johann',
    };

    const result = await service.update(user.id, currentUser, data);

    expect(result.code).toBe(200);
    expect(result.success).toBeTruthy();
    expect(result.message).toMatch(/Usuário.*sucesso/i);
  });

  it('REMOVE - Deve retornar 404 quando o usuário não for encontrado.', async () => {
    sequelizeMock.findByPk.mockResolvedValue(null);

    const result = await service.remove(user.id);

    expect(result.code).toBe(404);
    expect(result.success).toBeFalsy();
    expect(result.message).toMatch(/Usuário.*não.*encontrado/i);
  });

  it('REMOVE - Deve retornar 404 quando o usuário não for encontrado.', async () => {
    sequelizeMock.findByPk.mockResolvedValue({
      ...user,
      destroy: jest.fn(),
    });

    const result = await service.remove(user.id);

    expect(result.code).toBe(200);
    expect(result.success).toBeTruthy();
    expect(result.message).toMatch(/Usuário.*sucesso/i);
  });
});
