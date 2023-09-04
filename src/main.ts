import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { ConfigsService } from './configs/configs.service';
import { CONSTANTS } from './constants';
import * as express from 'express';

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

  // Initialize rawBody
  app.use(
    express.json({
      limit: '5mb',
      verify: (req: any, res, buf) => {
        req.rawBody = buf.toString();
      },
    }),
  );

  await app.listen(server.port);
}
bootstrap();
