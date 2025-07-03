import { Test, TestingModule } from '@nestjs/testing';
import { UserMock } from '../../mock/user.mock';
import { AuthService } from '../service/auth.service';
import { AuthController } from './auth.controller';

describe('AuthController', () => {
  let controller: AuthController;

  const sequelizeMock = {
    create: jest.fn(),
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: sequelizeMock,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('POST /auth/register — deve registrar um usuário', async () => {
    const mockUser = UserMock.build({
      name: 'Johann',
      email: 'johann@email.com',
    });

    sequelizeMock.create.mockResolvedValue({
      success: true,
      code: 201,
      message: 'Usuário criado com sucesso!',
      data: mockUser,
    });

    const result = await controller.create({
      name: mockUser.name,
      email: mockUser.email,
      password: mockUser.password,
      role: mockUser.role,
    });

    expect(result.code).toBe(201);
    expect(result.success).toBeTruthy();
    expect(result.message).toMatch(/Usuário.*sucesso/i);
    expect(result.data).toEqual(mockUser);
  });

  it('POST /auth/register — deve retornar erro no servidor para criar um usuário', async () => {
    const mockUser = UserMock.build({
      name: 'Johann',
      email: 'johann@email.com',
    });

    sequelizeMock.create.mockRejectedValue({
      success: false,
      code: 500,
      message: 'Erro no servidor:',
    });

    const result = await controller.create({
      name: mockUser.name,
      email: mockUser.email,
      password: mockUser.password,
      role: mockUser.role,
    });

    expect(result.code).toBe(500);
    expect(result.success).toBeFalsy();
    expect(result.message).toMatch(/Erro.*servidor/i);
  });

  it('POST /auth/login - deve fazer login do usuário', async () => {
    const body = { email: 'email@email.com', password: 'senha123' };

    sequelizeMock.login.mockResolvedValue({
      success: true,
      code: 200,
      message: 'Login efetuado com sucesso !!!',
      data: { token: '' },
    });

    const result = await controller.login(body);

    expect(result.code).toBe(200);
    expect(result.success).toBeTruthy();
    expect(result.message).toMatch(/Login.*sucesso/i);
  });

  it('POST /auth/login - deve retornar erro no servidor para fazer um login', async () => {
    const body = { email: 'email@email.com', password: 'senha123' };

    sequelizeMock.login.mockRejectedValue({
      success: false,
      code: 500,
      message: 'Erro no servidor:',
    });

    const result = await controller.login(body);

    expect(result.code).toBe(500);
    expect(result.success).toBeFalsy();
    expect(result.message).toMatch(/Erro.*servidor/i);
  });
});
