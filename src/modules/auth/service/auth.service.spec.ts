import { getModelToken } from '@nestjs/sequelize';
import { Test, TestingModule } from '@nestjs/testing';
import { UserMock } from '@/config/mock/user.mock';
import { User } from '@/config/models/user.model';
import { Bcrypt, JWT } from '@/config/utils';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  const sequelizeMock = {
    findOne: jest.fn(),
    create: jest.fn(),
  };

  const bcryptMock = {
    generateHash: jest.fn(),
    verify: jest.fn(),
  };

  const jwtMock = {
    generateToken: jest.fn(),
    verifyToken: jest.fn(),
  };

  const user = {
    ...UserMock.build(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getModelToken(User), useValue: sequelizeMock },
        { provide: Bcrypt, useValue: bcryptMock },
        { provide: JWT, useValue: jwtMock },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('CREATE - Deve retornar 409 quando o e-mail informado já existir', async () => {
    sequelizeMock.findOne.mockResolvedValue(user.email);

    const result = await service.create({
      name: user.name,
      email: user.email,
      password: user.password,
      role: user.role,
    });

    expect(result.code).toBe(409);
    expect(result.success).toBeFalsy();
    expect(result.message).toMatch(/e-mail.*cadastrado/i);
  });

  it('CREATE - Deve retornar 201 quando fornecer um body válido e um e-mail unico', async () => {
    sequelizeMock.findOne.mockResolvedValue(null);

    sequelizeMock.create.mockResolvedValue({ ...user });

    const hashPassword = await bcryptMock.generateHash(user.password);

    const result = await service.create({
      name: user.name,
      email: user.email,
      password: hashPassword,
      role: user.role,
    });

    expect(result.code).toBe(201);
    expect(result.success).toBeTruthy();
    expect(result.message).toMatch(/Usuário.*sucesso/i);
  });

  it('LOGIN - Deve retornar 404 quando o e-mail estiver incorreto', async () => {
    sequelizeMock.findOne.mockResolvedValue(null);

    const result = await service.login({
      email: 'any_email',
      password: user.password,
    });

    expect(result.code).toBe(404);
    expect(result.success).toBeFalsy();
    expect(result.message).toMatch(/E-mail.*incorretos/i);
  });

  it('LOGIN - Deve retornar 404 quando o password estiver incorreto', async () => {
    sequelizeMock.findOne.mockResolvedValue(user.email);

    const result = await service.login({
      email: user.email,
      password: 'any_password',
    });

    expect(result.code).toBe(404);
    expect(result.success).toBeFalsy();
    expect(result.message).toMatch(/E-mail.*inválidos/i);
  });

  it('LOGIN - Deve retornar o usuário logado quando fornecido um body válido', async () => {
    sequelizeMock.findOne.mockResolvedValue(user);

    bcryptMock.verify.mockResolvedValue(true);

    jwtMock.generateToken.mockReturnValue('fake-token');

    const result = await service.login({
      email: user.email,
      password: user.password,
    });

    expect(result.code).toBe(200);
    expect(result.success).toBeTruthy();
    expect(result.message).toMatch(/Login.*sucesso/i);
  });
});
