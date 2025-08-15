import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupObservability } from '@connector/observability';

async function bootstrap() {
  setupObservability({ serviceName: 'api' });
  const app = await NestFactory.create(AppModule, { snapshot: true });
  await app.listen(process.env.PORT ? Number(process.env.PORT) : 3000);
}
bootstrap();
