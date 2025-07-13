import { CanActivate } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { RolesGuard } from '../../../config/guards/roles.guard';
import { UserMock } from '../../../config/mock/user.mock';
import { CustomRequest } from '../../../config/types';
import { UserService } from '../service/user.service';
import { UserController } from './user.controller';

export class RolesGuardMock implements CanActivate {
  canActivate(): boolean {
    return true;
  }
}

describe('UserController', () => {
  let controller: UserController;

  const mockUser = UserMock.build({
    name: 'Johann',
    email: 'johann@email.com',
  });

  const sequelizeMock = {
    findAll: jest.fn(),
    findInactiveUsers: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const req = {
    user: {},
  } as CustomRequest;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: sequelizeMock,
        },
      ],
    })
      .overrideGuard(RolesGuard) // 🔥 Aqui substitui o guard original
      .useClass(RolesGuardMock)
      .compile();

    controller = module.get<UserController>(UserController);
    jest.clearAllMocks();
  });

  it('GET /users', async () => {
    sequelizeMock.findAll.mockResolvedValue({
      success: true,
      code: 200,
      message: 'Usuários buscados com sucesso!',
      data: [mockUser],
    });

    const result = await controller.findAll(mockUser);

    expect(result.code).toBe(200);
    expect(result.success).toBeTruthy();
    expect(result.message).toMatch(/Usuários.*sucesso/i);
  });

  it('GET /inactve', async () => {
    sequelizeMock.findInactiveUsers.mockResolvedValue({
      success: true,
      code: 200,
      message: 'Usuários inativos listados com sucesso!',
      data: mockUser,
    });

    const result = await controller.findInactive();

    expect(result.code).toBe(200);
    expect(result.success).toBeTruthy();
    expect(result.message).toMatch(/Usuários.*sucesso/i);
  });

  it('GET /users/:id', async () => {
    sequelizeMock.findOne.mockResolvedValue({
      success: true,
      code: 200,
      message: 'Usuário encontrado pelo ID com sucesso !!!',
      data: mockUser,
    });

    const result = await controller.findOne(mockUser.id, req);

    expect(result.code).toBe(200);
    expect(result.success).toBeTruthy();
    expect(result.message).toMatch(/Usuário.*sucesso/i);
  });

  it('PUT /users/:id', async () => {
    const body = {};

    sequelizeMock.update.mockResolvedValue({
      success: true,
      code: 200,
      message: 'Usuário atualizado com sucesso!',
      data: mockUser,
    });

    const result = await controller.update(mockUser.id, req, body);

    expect(result.code).toBe(200);
    expect(result.success).toBeTruthy();
    expect(result.message).toMatch(/Usuário.*sucesso/i);
  });

  it('DELETE /users/:id', async () => {
    sequelizeMock.remove.mockResolvedValue({
      success: true,
      code: 200,
      message: 'Usuário removido com sucesso',
      data: mockUser,
    });

    const result = await controller.remove(mockUser.id);

    expect(result.code).toBe(200);
    expect(result.success).toBeTruthy();
    expect(result.message).toMatch(/Usuário.*sucesso/i);
  });
});
