import { NestExpressApplication } from '@nestjs/platform-express';
import { SequelizeModule } from '@nestjs/sequelize';
import { Test, TestingModule } from '@nestjs/testing';
import { Server } from 'http';
import supertest from 'supertest';
import { AuthModule } from '../src/auth/auth.module';
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
});
