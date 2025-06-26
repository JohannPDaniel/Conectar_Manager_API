import { NestFactory, Reflector } from '@nestjs/core';
import 'dotenv/config';
import express from 'express';
import { AppModule } from './app.module';
import { RolesGuard } from './auth/guards/roles.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(express.json);
  const reflector = app.get(Reflector);
  app.useGlobalGuards(new RolesGuard(reflector));

  const port = process.env.PORT ?? 3000;
  await app.listen(port, () => {
    console.log(`🚀 Server running on port http://localhost:${port}`);
  });
}

bootstrap().catch((err) => {
  console.error('Falha ao iniciar a aplicação:', err);
  process.exit(1);
});
