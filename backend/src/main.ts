import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ResponseTransformInterceptor } from './common/interceptors/response-transform.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('app.port') || 3001;
  const env = configService.get<string>('app.nodeEnv') || 'development';
  const prefix = configService.get<string>('app.apiPrefix') || 'api/v1';

  // Set global prefix
  app.setGlobalPrefix(prefix);

  // Enable CORS
  app.enableCors();

  // Apply global filters and interceptors
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new ResponseTransformInterceptor());

  // Setup Swagger in development environment
  if (env === 'development') {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('DHOP API')
      .setDescription('District Health Operations Platform API Descriptions')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup(`${prefix}/docs`, app, document);
    logger.log(`Swagger documentation available at: http://localhost:${port}/${prefix}/docs`);
  }

  await app.listen(port);
  logger.log(`Application successfully listening on port: ${port} in ${env} mode`);
}
bootstrap();
