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
import { makeToken } from '../makeToken';
import { TestDatabaseModule } from '../TestDatabase.module';

describe('UserController (e2e) - PUT - /users/:id', () => {
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
    const response = await supertest(server).put(`${endpoint}/abc`);

    expect(response.status).toBe(401);
    expect(response.body.success).toBeFalsy();
    expect(response.body.message).toMatch(/Token.*autenticado/i);
  });

  it('Deve retornar 401 se o formato do token não tiver Bearer', async () => {
    token = 'any_token';

    const response = await supertest(server)
      .put(`${endpoint}/abc`)
      .set('Authorization', `${token}`);

    expect(response.status).toBe(401);
    expect(response.body.success).toBeFalsy();
    expect(response.body.message).toMatch(/Bearer.*token/i);
  });

  it('Deve retornar 401 se o usuário não for autenticado com JWT', async () => {
    token = 'any_token';

    const response = await supertest(server)
      .put(`${endpoint}/abc`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(401);
    expect(response.body.success).toBeFalsy();
    expect(response.body.message).toMatch(/Usuário.*autenticado/i);
  });

  it('Deve retornar 400 se o parametro não for um UUID', async () => {
    token = makeToken({} as AuthUser);

    const response = await supertest(server)
      .put(`${endpoint}/abc`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body.success).toBeFalsy();
    expect(response.body.message).toMatch(/Identificador.*UUID/i);
  });

  it('Deve retornar 400 se o nome, se vier for diferente de um formato de texto', async () => {
    token = makeToken({} as AuthUser);
    const user = UserMock.build();

    const body = { name: true };

    const response = await supertest(server)
      .put(`${endpoint}/${user.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(body);

    expect(response.status).toBe(400);
    expect(response.body.success).toBeFalsy();
    expect(response.body.message).toMatch(/nome.*texto/i);
  });

  it('Deve retornar 400 se o email, se vier for diferente de um formato de e-mail: ****@****.com', async () => {
    token = makeToken({} as AuthUser);
    const user = UserMock.build();

    const body = { name: 'abc', email: 'email' };

    const response = await supertest(server)
      .put(`${endpoint}/${user.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(body);

    expect(response.status).toBe(400);
    expect(response.body.success).toBeFalsy();
    expect(response.body.message).toBe(
      'O atributo e-mail deve vir em formato de e-mail: ****@****.com !!!',
    );
  });

  it('Deve retornar 400 se a senha, se vier for diferente do formato de texto.', async () => {
    token = makeToken({} as AuthUser);
    const user = UserMock.build();

    const body = { name: 'abc', email: 'email@email.com', password: true };

    const response = await supertest(server)
      .put(`${endpoint}/${user.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(body);

    expect(response.status).toBe(400);
    expect(response.body.success).toBeFalsy();
    expect(response.body.message).toMatch(/senha.*texto/i);
  });

  it('Deve retornar 400 se o nome, se vier tiver menos de 4 caracteres', async () => {
    token = makeToken({} as AuthUser);
    const user = UserMock.build();

    const body = { name: 'abc', email: 'email@email.com', password: 'abc' };

    const response = await supertest(server)
      .put(`${endpoint}/${user.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(body);

    expect(response.status).toBe(400);
    expect(response.body.success).toBeFalsy();
    expect(response.body.message).toMatch(/nome.*caracteres/i);
  });

  it('Deve retornar 400 se a senha, se vier tiver menos de 4 caracteres', async () => {
    token = makeToken({} as AuthUser);
    const user = UserMock.build();

    const body = { name: 'Johann', email: 'email@email.com', password: 'abc' };

    const response = await supertest(server)
      .put(`${endpoint}/${user.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(body);

    expect(response.status).toBe(400);
    expect(response.body.success).toBeFalsy();
    expect(response.body.message).toMatch(/senha.*caracteres/i);
  });

  it('Deve retornar um usuário atualizado quando fornecido um Id válido e um body válido', async () => {
    token = makeToken({} as AuthUser);
    const user = UserMock.build();

    const body = {
      name: 'Johann',
      email: 'email@email.com',
      password: 'senha123',
    };

    jest.spyOn(UserService.prototype, 'update').mockResolvedValue({
      success: true,
      code: 200,
      message: 'Usuário atualizado com sucesso!',
      data: {},
    });

    const response = await supertest(server)
      .put(`${endpoint}/${user.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(body);

    expect(response.status).toBe(200);
    expect(response.body.success).toBeTruthy();
    expect(response.body.message).toMatch(/Usuário.*sucesso/i);
  });

  it('Deve retornar 500 quando houver um erro no servidor.', async () => {
    token = makeToken({ role: 'admin' } as AuthUser);
    const user = UserMock.build();

    const body = {};

    jest
      .spyOn(UserService.prototype, 'update')
      .mockRejectedValue(new Error('Excessão'));

    const response = await supertest(server)
      .put(`${endpoint}/${user.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(body);

    expect(response.body.code).toBe(500);
    expect(response.body.success).toBeFalsy();
    expect(response.body.message).toMatch(/Erro.*servidor/i);
  });
});
