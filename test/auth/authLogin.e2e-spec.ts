import { DatabaseModule } from '@/config/database/database.module';
import { User } from '@/config/models/user.model';
import { AuthModule } from '@/modules/auth/auth.module';
import { AuthService } from '@/modules/auth/service/auth.service';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SequelizeModule } from '@nestjs/sequelize';
import { Test, TestingModule } from '@nestjs/testing';
import { Server } from 'http';
import supertest from 'supertest';

describe('AuthController (e2e) - /auth/login', () => {
  let app: NestExpressApplication;
  let server: Server;
  const endpoint = '/auth/login';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule, SequelizeModule.forFeature([User]), AuthModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    server = app.getHttpServer();
  });

  afterAll(async () => {
    await app.close();
  });

  it('Deve retornar 400 quando não for informado um e-mail', async () => {
    const body = {};

    const response = await supertest(server).post(endpoint).send(body);

    expect(response.status).toBe(400);
    expect(response.body.success).toBeFalsy();
    expect(response.body.message).toMatch(/email.*obrigatório/i);
  });

  it('Deve retornar 400 quando não for informado uma senha', async () => {
    const body = { email: 1 };

    const response = await supertest(server).post(endpoint).send(body);

    expect(response.status).toBe(400);
    expect(response.body.success).toBeFalsy();
    expect(response.body.message).toMatch(/senha.*obrigatório/i);
  });

  it('Deve retornar 400 quando o e-mail não vir em formato de texto', async () => {
    const body = { email: 1, password: 2 };

    const response = await supertest(server).post(endpoint).send(body);

    expect(response.status).toBe(400);
    expect(response.body.success).toBeFalsy();
    expect(response.body.message).toMatch(/email.*texto/i);
  });

  it('Deve retornar 400 quando a senha não vir em formato de texto', async () => {
    const body = { email: '1', password: 2 };

    const response = await supertest(server).post(endpoint).send(body);

    expect(response.status).toBe(400);
    expect(response.body.success).toBeFalsy();
    expect(response.body.message).toMatch(/senha.*texto/i);
  });

  it('Deve retornar 400 quando o e-mail não vir no formato ****@****.com', async () => {
    const body = { email: '1', password: '2' };

    const response = await supertest(server).post(endpoint).send(body);

    expect(response.status).toBe(400);
    expect(response.body.success).toBeFalsy();
    expect(response.body.message).toBe(
      'O e-mail informado deve estar em um formato de E-mail ****@****.com',
    );
  });

  it('Deve retornar 400 quando a senha não tiver pelo menos 4 caracteres', async () => {
    const body = { email: 'email@email.com', password: '2' };

    const response = await supertest(server).post(endpoint).send(body);

    expect(response.status).toBe(400);
    expect(response.body.success).toBeFalsy();
    expect(response.body.message).toMatch(/senha.*caracteres/i);
  });

  it('Deve retornar um login efetuado quando informado um body válido', async () => {
    const body = { email: 'email@email.com', password: 'senha123' };

    jest.spyOn(AuthService.prototype, 'login').mockResolvedValue({
      success: true,
      code: 200,
      message: 'Login efetuado com sucesso !!!',
      data: { token: 'any_token' },
    });

    const response = await supertest(server).post(endpoint).send(body);

    expect(response.body.code).toBe(200);
    expect(response.body.success).toBeTruthy();
    expect(response.body.message).toMatch(/Login.*sucesso/i);
  });

  it('Deve retornar 500 quando houver um erro de servidor', async () => {
    const body = { email: 'email@email.com', password: 'senha123' };

    jest
      .spyOn(AuthService.prototype, 'login')
      .mockRejectedValue(new Error('Excessão !!!'));

    const response = await supertest(server).post(endpoint).send(body);

    expect(response.body.code).toBe(500);
    expect(response.body.success).toBeFalsy();
    expect(response.body.message).toMatch(/Erro.*servidor/i);
  });
});
