import { Test, TestingModule } from '@nestjs/testing';
import { UserMock } from '../../mock/user.mock';
import { AuthService } from '../service/auth.service';
import { AuthController } from './auth.controller';

describe('AuthController', () => {
  let controller: AuthController;

  const sequelizeMock = {
    create: jest.fn(),
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

  it('Deve retornar o usuário criado', async () => {
    const mockUser = UserMock.build({
      name: 'Johann',
      email: 'johann@email.com',
    });

    // sequelizeMock.create.mockResolvedValue({
    //   success: true,
    //   code: 201,
    //   message: 'Usuário criado com sucesso!',
    //   data: mockUser,
    // });

    jest.spyOn(AuthService.prototype, 'create').mockResolvedValue({
      success: true,
      code: 201,
      message: 'Usuário criado com sucesso!',
      data: mockUser,
    });

    const result = await controller.create({
      name: mockUser.name,
      email: mockUser.email,
      password: 'senha123',
      role: mockUser.role,
    });

    expect(result.code).toBe(201);
    expect(result.success).toBeTruthy();
    expect(result.message).toMatch(/Usuário.*sucesso/i);
    expect(result.data).toEqual(mockUser);
  });
});
