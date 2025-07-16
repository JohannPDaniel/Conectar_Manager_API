import { NestExpressApplication } from '@nestjs/platform-express';
import { SequelizeModule } from '@nestjs/sequelize';
import { Test, TestingModule } from '@nestjs/testing';
import { Server } from 'http';
import supertest from 'supertest';
import { User } from '../../src/config/models/user.model';
import { AuthUser } from '../../src/modules/auth/dto';
import { UserService } from '../../src/modules/user/service/user.service';
import { UserModule } from '../../src/modules/user/user.module';
import { TestDatabaseModule } from '../TestDatabase.module';
import { makeToken } from '../makeToken';

describe('UserController (e2e) - GET - /users/inactive', () => {
  let app: NestExpressApplication;
  let server: Server;
  const endpoint = '/users/inactive';
  let token: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TestDatabaseModule,
        SequelizeModule.forFeature([User]),
        UserModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    server = app.getHttpServer();
  });

  afterAll(async () => {
    await app.close();
  });

  it('Deve retornar 401 se o token não for enviado', async () => {
    const response = await supertest(server).get(endpoint);

    expect(response.status).toBe(401);
    expect(response.body.success).toBeFalsy();
    expect(response.body.message).toMatch(/Token.*autenticado/i);
  });

  it('Deve retornar 401 se o formato do token não tiver Bearer', async () => {
    token = 'any_token';

    const response = await supertest(server)
      .get(endpoint)
      .set('Authorization', `${token}`);

    expect(response.status).toBe(401);
    expect(response.body.success).toBeFalsy();
    expect(response.body.message).toMatch(/Bearer.*token/i);
  });

  it('Deve retornar 401 se o usuário não for autenticado com JWT', async () => {
    token = 'any_token';

    const response = await supertest(server)
      .get(endpoint)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(401);
    expect(response.body.success).toBeFalsy();
    expect(response.body.message).toMatch(/Usuário.*autenticado/i);
  });

  it('Deve retornar os usuários inativos quando informado um token válido', async () => {
    token = makeToken({ role: 'admin' } as AuthUser);

    jest.spyOn(UserService.prototype, 'findInactiveUsers').mockResolvedValue({
      success: true,
      code: 200,
      message: 'Usuários inativos listados com sucesso!',
      data: {},
    });

    const response = await supertest(server)
      .get(endpoint)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBeTruthy();
    expect(response.body.message).toMatch(/Usuários.*sucesso/i);
  });

  it('Deve retornar 500 quando houver um erro de servidor', async () => {
    token = makeToken({ role: 'admin' } as AuthUser);

    jest
      .spyOn(UserService.prototype, 'findInactiveUsers')
      .mockRejectedValue(new Error('Excessão !!!'));

    const response = await supertest(server)
      .get(endpoint)
      .set('Authorization', `Bearer ${token}`);

    expect(response.body.code).toBe(500);
    expect(response.body.success).toBeFalsy();
    expect(response.body.message).toMatch(/Erro.*servidor/i);
  });
});
