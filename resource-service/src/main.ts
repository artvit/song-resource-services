import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    rawBody: true,
  });
  app.useBodyParser('raw', { type: 'audio/mpeg', limit: '100mb' });
  const port = app.get(ConfigService).get('PORT');
  app.setGlobalPrefix('api');
  await app.listen(port);
}
bootstrap();
