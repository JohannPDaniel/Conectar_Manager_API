import { User } from '@/config/models/user.model';
import { AuthUser } from '@/modules/auth/dto';
import { UserService } from '@/modules/user/service/user.service';
import { UserModule } from '@/modules/user/user.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SequelizeModule } from '@nestjs/sequelize';
import { Test, TestingModule } from '@nestjs/testing';
import { Server } from 'http';
import supertest from 'supertest';
import { makeToken } from '../makeToken';
import { TestDatabaseModule } from '../TestDatabase.module';

describe('UserController (e2e) - GET - /users', () => {
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

  it('Deve retornar 400 se a permissão for diferente de admin ou user', async () => {
    token = makeToken({ role: 'admin' } as AuthUser);

    const query = {
      role: 1,
    };

    const response = await supertest(server)
      .get(`${endpoint}?role=${query.role}`)
      .set(`Authorization`, `Bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body.success).toBeFalsy();
    expect(response.body.message).toMatch(/admin.*user/i);
  });

  it('Deve retornar 400 se o sortBy for diferente de name ou createdAt', async () => {
    token = makeToken({ role: 'admin' } as AuthUser);

    const query = {
      role: 'user',
      sortBy: true,
    };

    const response = await supertest(server)
      .get(`${endpoint}?role=${query.role}&sortBy=${query.sortBy}`)
      .set(`Authorization`, `Bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body.success).toBeFalsy();
    expect(response.body.message).toMatch(/name.*createdAt/i);
  });

  it('Deve retornar 400 se o order for diferente de ASC ou DESC', async () => {
    token = makeToken({ role: 'admin' } as AuthUser);

    const query = {
      role: 'user',
      sortBy: 'name',
      order: true,
    };

    const response = await supertest(server)
      .get(
        `${endpoint}?role=${query.role}&sortBy=${query.sortBy}&order=${query.order}`,
      )
      .set(`Authorization`, `Bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body.success).toBeFalsy();
    expect(response.body.message).toMatch(/ASC.*DESC/i);
  });

  it('Deve retornar os usuários buscados quando fornecido uma consulta válida', async () => {
    token = makeToken({ role: 'admin' } as AuthUser);

    const query = {
      role: 'admin' as 'admin' | 'user',
      name: 'Johann',
      sortBy: 'name' as 'name' | 'createdAt',
      order: 'ASC' as 'ASC' | 'DESC',
    };

    const { role, name, sortBy, order } = query;

    jest.spyOn(UserService.prototype, 'findAll').mockResolvedValue({
      success: true,
      code: 200,
      message: 'Usuários buscados com sucesso!',
      data: {},
    });

    const response = await supertest(server)
      .get(
        `${endpoint}?role=${role}&name=${name}&sortBy=${sortBy}&order=${order}`,
      )
      .set('Authorization', `Bearer ${token}`);

    expect(response.body.code).toBe(200);
    expect(response.body.success).toBeTruthy();
    expect(response.body.message).toMatch(/Usuários.*sucesso/i);
  });

  it('Deve retornar 500 quando houver um erro no servidor.', async () => {
    token = makeToken({ role: 'admin' } as AuthUser);

    const query = {
      role: 'admin' as 'admin' | 'user',
      name: 'Johann',
      sortBy: 'name' as 'name' | 'createdAt',
      order: 'ASC' as 'ASC' | 'DESC',
    };

    const { role, name, sortBy, order } = query;

    jest
      .spyOn(UserService.prototype, 'findAll')
      .mockRejectedValue(new Error('Excessão'));

    const response = await supertest(server)
      .get(
        `${endpoint}?role=${role}&name=${name}&sortBy=${sortBy}&order=${order}`,
      )
      .set('Authorization', `Bearer ${token}`);

    expect(response.body.code).toBe(500);
    expect(response.body.success).toBeFalsy();
    expect(response.body.message).toMatch(/Erro.*servidor/i);
  });
});
