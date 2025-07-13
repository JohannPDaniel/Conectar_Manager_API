import { DatabaseModule } from '@/config/database/database.module';
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

describe('UserController (e2e) /users', () => {
  let app: NestExpressApplication;
  let server: Server;
  const endpoint = '/users';
  let token: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule, SequelizeModule.forFeature([User]), UserModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    server = app.getHttpServer();
  });

  afterAll(async () => {
    await app.close();
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
});
