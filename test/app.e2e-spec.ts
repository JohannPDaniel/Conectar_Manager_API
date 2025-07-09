import { NestExpressApplication } from '@nestjs/platform-express';
import { Test, TestingModule } from '@nestjs/testing';
import { Sequelize } from 'sequelize-typescript';
import { AppModule } from '../src/app.module';
import { UserModule } from '../src/user/user.module';
import supertest from 'supertest';

describe('AppController (e2e)', () => {
  let app: NestExpressApplication;
  let sequelize: Sequelize;
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, UserModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    sequelize = moduleFixture.get(Sequelize); // <- Aqui você injeta o Sequelize
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
    const server = app.getHttpServer();

    const response = await supertest(server).get('/').expect(200);

    expect(response.text).toBe('Hello World!');
    // return request(server).get('/').expect(200).expect('Hello World!');
  });
});
