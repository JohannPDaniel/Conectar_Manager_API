import { NestExpressApplication } from '@nestjs/platform-express';
import { SequelizeModule } from '@nestjs/sequelize';
import { Test, TestingModule } from '@nestjs/testing';
import { Server } from 'http';
import supertest from 'supertest';
import { AuthModule } from '../../src/auth/auth.module';
import { DatabaseModule } from '../../src/database/database.module';
import { User } from '../../src/models/user.model';

describe('UserController (e2e) /users', () => {
  let app: NestExpressApplication;
  let server: Server;
  const endpoint = '/users';

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

  it('Deve retornar os usuários buscados quando fornecido uma consulta válida', async () => {
    const token = 'any_token';
    const role = 'user' as 'user' | 'admin';
    const name = 'Johann';
    const sortBy = 'name' as 'name' | 'createdAt';
    const order = 'ASC' as 'ASC' | 'DESC';

    const response = await supertest(server)
      .get(
        `${endpoint}?role=${role}&name=${name}&sortBy=${sortBy}&order=${order}`,
      )
      .set('Authorization', `Bearer ${token}`);
  });
});
