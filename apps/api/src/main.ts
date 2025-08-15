import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupObservability } from '@connector/observability';
import { loadConfig } from '@connector/config';

async function bootstrap() {
  setupObservability({ serviceName: 'api' });
  const cfg = loadConfig('api');
  const app = await NestFactory.create(AppModule, { snapshot: true });
  await app.listen(cfg.port ?? 3000);
}
bootstrap();
