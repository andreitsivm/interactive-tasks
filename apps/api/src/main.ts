import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import basicAuth from 'express-basic-auth';
import { AppModule } from './app.module';

const defaultPort = 4000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  if (process.env.NODE_ENV !== 'production') {
    const swaggerUser = process.env.SWAGGER_USER;
    const swaggerPassword = process.env.SWAGGER_PASSWORD;

    if (swaggerUser && swaggerPassword) {
      app.use(
        '/api/docs',
        basicAuth({
          users: { [swaggerUser]: swaggerPassword },
          challenge: true,
        }),
      );
    }

    const config = new DocumentBuilder()
      .setTitle('Interactive Tasks API')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);
  }

  await app.listen(process.env.PORT ?? defaultPort);
}
bootstrap();
