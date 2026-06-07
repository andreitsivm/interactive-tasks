import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const defaultPort = 4000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? defaultPort);
}
bootstrap();
