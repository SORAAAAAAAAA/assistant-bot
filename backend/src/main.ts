import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: 'https://assistant.internal', credentials: true });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // This is for API Documentation
  const config = new DocumentBuilder()
    .setTitle('Assistant Bot API')
    .setDescription('API endpoints for SEIWA KAIUN Assistant Bot')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 8000, '127.0.0.1');
}
bootstrap();