import { NestExpressApplication } from '@nestjs/platform-express';
import { SequelizeModule } from '@nestjs/sequelize';
import { Test, TestingModule } from '@nestjs/testing';
import { Server } from 'http';
import supertest from 'supertest';
import { UserMock } from '../../src/config/mock/user.mock';
import { User } from '../../src/config/models/user.model';
import { AuthUser } from '../../src/modules/auth/dto';
import { UserService } from '../../src/modules/user/service/user.service';
import { UserModule } from '../../src/modules/user/user.module';
import { TestDatabaseModule } from '../TestDatabase.module';
import { makeToken } from '../makeToken';

describe('UsersController (e2e) - GET - /users/:id', () => {
  let app: NestExpressApplication;
  let server: Server;
  const endpoint = '/users';
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

  it('Deve retornar 400 se o parametro não for um UUID', async () => {
    token = makeToken({} as AuthUser);

    const response = await supertest(server)
      .get(`${endpoint}/abc`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body.success).toBeFalsy();
    expect(response.body.message).toMatch(/Identificador.*UUID/i);
  });

  it('Deve retornar um usuário buscado quando for informado um id Válido', async () => {
    token = makeToken({} as AuthUser);
    const user = UserMock.build();

    jest.spyOn(UserService.prototype, 'findOne').mockResolvedValue({
      success: true,
      code: 200,
      message: 'Usuário encontrado pelo ID com sucesso !!!',
      data: {},
    });

    const response = await supertest(server)
      .get(`${endpoint}/${user.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBeTruthy();
    expect(response.body.message).toMatch(/Usuário.*sucesso/i);
  });

  it('Deve retornar 500 quando houver um erro no servidor.', async () => {
    token = makeToken({ role: 'admin' } as AuthUser);
    const user = UserMock.build();

    jest
      .spyOn(UserService.prototype, 'findOne')
      .mockRejectedValue(new Error('Excessão'));

    const response = await supertest(server)
      .get(`${endpoint}/${user.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.body.code).toBe(500);
    expect(response.body.success).toBeFalsy();
    expect(response.body.message).toMatch(/Erro.*servidor/i);
  });
});
