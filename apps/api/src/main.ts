import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule } from '@nestjs/swagger';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import { buildSwaggerDocumentBase } from './swagger.config';

async function bootstrap() {
  const expressApp = express();

  // Middleware to capture raw body for webhook signature verification
  expressApp.use(
    '/webhooks',
    express.raw({ type: 'application/json', limit: '10mb' }),
    (req, res, next) => {
      (req as any).rawBody = req.body;
      next();
    },
  );

  // Regular JSON body parser for API routes
  expressApp.use(express.json({ limit: '10mb' }));

  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressApp),
    {
      bodyParser: false, // We're handling body parsing with Express middleware
    },
  );

  // Enable CORS
  const allowedOrigins = process.env.CORS_ALLOWED_ORIGINS
    ? process.env.CORS_ALLOWED_ORIGINS.split(',').map((origin) => origin.trim())
    : '*';

  app.enableCors({
    origin: allowedOrigins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders:
      'X-API-KEY,X-Lomi-Signature,X-Lomi-Event,X-Webhook-ID,X-Merchant-Signature,Content-Type,Authorization',
  });

  const document = SwaggerModule.createDocument(
    app,
    buildSwaggerDocumentBase(),
  );
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
