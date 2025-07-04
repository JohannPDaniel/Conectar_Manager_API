import { getModelToken } from '@nestjs/sequelize';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtModule } from '../../JWT/jwt.module';
import { UserMock } from '../../mock/user.mock';
import { User } from '../../models/user.model';
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
      imports: [JwtModule],
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
      id: 'id-diferente',
      name: user.name,
      role: user.role,
    });

    expect(result.code).toBe(403);
    expect(result.success).toBeFalsy();
    expect(result.message).toBe('Você só pode visualizar seus próprios dados.');
  });
});
