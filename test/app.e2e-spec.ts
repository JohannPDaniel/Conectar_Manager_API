import { NestExpressApplication } from '@nestjs/platform-express';
import { Test, TestingModule } from '@nestjs/testing';
import { Server } from 'http';
import { Sequelize } from 'sequelize-typescript';
import supertest from 'supertest';
import { AppModule } from '../src/app.module';
import { UserModule } from '../src/modules/user/user.module';

describe('AppController (e2e)', () => {
  let app: NestExpressApplication;
  let server: Server;
  const endpoint = '/';

  let sequelize: Sequelize;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, UserModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    sequelize = moduleFixture.get(Sequelize); // <- Aqui você injeta o Sequelize
    server = app.getHttpServer();
  });

  afterEach(async () => {
    // Limpa os dados (ajuste os modelos conforme necessário)
    await sequelize.truncate({ cascade: true });
  });

  afterAll(async () => {
    await sequelize.close(); // Fecha o Sequelize
    await app.close(); // Fecha o Nest
  });

  it('/ (GET)', async () => {
    const response = await supertest(server).get(endpoint).send('Hello World!');

    expect(response.text).toBe('Hello World!');
  });
});
