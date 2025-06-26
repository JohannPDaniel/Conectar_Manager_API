import { NestFactory } from '@nestjs/core';
import 'dotenv/config';
import express from 'express';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(express.json());

  const port = process.env.PORT ?? 3000;
  await app.listen(port, () => {
    console.log(`🚀 Server running on port http://localhost:${port}`);
  });
}

bootstrap().catch((err) => {
  console.error('Falha ao iniciar a aplicação:', err);
  process.exit(1);
});
