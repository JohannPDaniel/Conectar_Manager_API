import { NestExpressApplication } from '@nestjs/platform-express';
import { SequelizeModule } from '@nestjs/sequelize';
import { Test, TestingModule } from '@nestjs/testing';
import { Server } from 'http';
import supertest from 'supertest';
import { AuthModule } from '../src/auth/auth.module';
import { UserDto } from '../src/auth/dto';
import { AuthService } from '../src/auth/service/auth.service';
import { User } from '../src/models/user.model';

describe('AuthController (e2e) - /auth/register', () => {
  let app: NestExpressApplication;
  let server: Server;
  const endpoint = '/auth/register';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        SequelizeModule.forRoot({
          dialect: 'postgres',
          uri: process.env.DATABASE_URL,
          autoLoadModels: true,
          synchronize: true,
          logging: false, // desativa logs no teste
        }),
        SequelizeModule.forFeature([User]),
        AuthModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    server = app.getHttpServer();
  });

  afterAll(async () => {
    await app.close(); // <-- importantíssimo
  });

  it('Deve retornar 400 quando o body vier vazio', async () => {
    const body = {};

    const response = await supertest(server).post(endpoint).send(body);

    expect(response.status).toBe(400);
    expect(response.body.success).toBeFalsy();
    expect(response.body.message).toMatch(/name.*obrigatório/i);
  });

  it('Deve retornar 400 quando o e-mail não for enviado', async () => {
    const body = { name: 1 };

    const response = await supertest(server).post(endpoint).send(body);

    expect(response.status).toBe(400);
    expect(response.body.success).toBeFalsy();
    expect(response.body.message).toMatch(/email.*obrigatório/i);
  });

  it('Deve retornar 400 quando a senha não for enviada', async () => {
    const body = { name: 1, email: 2 };

    const response = await supertest(server).post(endpoint).send(body);

    expect(response.status).toBe(400);
    expect(response.body.success).toBeFalsy();
    expect(response.body.message).toMatch(/password.*obrigatório/i);
  });

  it('Deve retornar 400 quando a permissão não for enviada', async () => {
    const body = { name: 1, email: 2, password: 3 };

    const response = await supertest(server).post(endpoint).send(body);

    expect(response.status).toBe(400);
    expect(response.body.success).toBeFalsy();
    expect(response.body.message).toMatch(/permissão.*obrigatório/i);
  });

  it('Deve retornar 400 quando o nome for diferente do formato de texto', async () => {
    const body = { name: 1, email: 2, password: 3, role: 4 };

    const response = await supertest(server).post(endpoint).send(body);

    expect(response.status).toBe(400);
    expect(response.body.success).toBeFalsy();
    expect(response.body.message).toMatch(/name.*texto/i);
  });

  it('Deve retornar 400 quando o e-mail for diferente do formato de texto', async () => {
    const body = { name: '1', email: 2, password: 3, role: 4 };

    const response = await supertest(server).post(endpoint).send(body);

    expect(response.status).toBe(400);
    expect(response.body.success).toBeFalsy();
    expect(response.body.message).toMatch(/email.*texto/i);
  });

  it('Deve retornar 400 quando a senha for diferente do formato de texto', async () => {
    const body = { name: '1', email: '2', password: 3, role: 4 };

    const response = await supertest(server).post(endpoint).send(body);

    expect(response.status).toBe(400);
    expect(response.body.success).toBeFalsy();
    expect(response.body.message).toMatch(/senha.*texto/i);
  });

  it('Deve retornar 400 quando a permissão for diferente de (admin) e (user)', async () => {
    const body = { name: '1', email: '2', password: '3', role: 4 };

    const response = await supertest(server).post(endpoint).send(body);

    expect(response.status).toBe(400);
    expect(response.body.success).toBeFalsy();
    expect(response.body.message).toMatch(/ADMIN.*USER/i);
  });

  it('Deve retornar 400 quando o nome tiver menos de 4 caracteres', async () => {
    const body = { name: '1', email: '2', password: '3', role: 'user' };

    const response = await supertest(server).post(endpoint).send(body);

    expect(response.status).toBe(400);
    expect(response.body.success).toBeFalsy();
    expect(response.body.message).toMatch(/name.*caracteres/i);
  });

  it('Deve retornar 400 quando o e-mail estiver em um formato diferente de ****@****.com', async () => {
    const body = { name: 'Johann', email: '2', password: '3', role: 'user' };

    const response = await supertest(server).post(endpoint).send(body);

    expect(response.status).toBe(400);
    expect(response.body.success).toBeFalsy();
    expect(response.body.message).toBe(
      'O e-mail informado deve estar em um formato de E-mail ****@****.com',
    );
  });

  it('Deve retornar 400 quando a senha tiver menos de 4 caracteres', async () => {
    const body = {
      name: 'Johann',
      email: 'email@email.com',
      password: '3',
      role: 'user',
    };

    const response = await supertest(server).post(endpoint).send(body);

    expect(response.status).toBe(400);
    expect(response.body.success).toBeFalsy();
    expect(response.body.message).toMatch(/senha.*caracteres/i);
  });

  it('Deve retornar um usuário criado quando informado um body válido', async () => {
    const body = {
      name: 'Johann',
      email: 'email@email.com',
      password: 'senha123',
      role: 'user',
    };

    jest.spyOn(AuthService.prototype, 'create').mockResolvedValue({
      success: true,
      code: 201,
      message: 'Usuário criado com sucesso!',
      data: {} as UserDto,
    });

    const response = await supertest(server).post(endpoint).send(body);

    expect(response.status).toBe(201);
    expect(response.body.success).toBeTruthy();
    expect(response.body.message).toMatch(/Usuário.*sucesso/i);
  });

  it('Deve retornar 500 quando houver um erro de servidor', async () => {
    const body = {
      name: 'Johann',
      email: 'email@email.com',
      password: 'senha123',
      role: 'user',
    };

    jest
      .spyOn(AuthService.prototype, 'create')
      .mockRejectedValue(new Error('Excessão !!!'));

    const response = await supertest(server).post(endpoint).send(body);

    expect(response.status).toBe(500);
    expect(response.body.success).toBeFalsy();
    expect(response.body.message).toMatch(/Erro.*servidor/i);
  });
});
