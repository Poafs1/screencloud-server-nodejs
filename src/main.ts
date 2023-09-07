import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { ConfigsService } from './configs/configs.service';
import { CONSTANTS } from './constants';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const { server, clientUrl } = app.get(ConfigsService);

  // CORS
  const corsOption: CorsOptions = CONSTANTS.enableCors
    ? {
        origin: clientUrl ? [...clientUrl.split(',')] : [],
        credentials: true,
      }
    : {};

  app.enableCors(corsOption);
  app.use(cookieParser());

  // Set global prefix
  app.setGlobalPrefix(CONSTANTS.globalPrefix);

  // Validation
  app.useGlobalPipes(new ValidationPipe());

  // Swagger
  const { swagger } = CONSTANTS;
  const config = new DocumentBuilder()
    .setTitle(swagger.title)
    .setDescription(swagger.description)
    .setVersion(swagger.version)
    .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup(swagger.prefix, app, document);

  await app.listen(server.port);
}
bootstrap();
