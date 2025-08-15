import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { setupObservability } from '@connector/observability';
import { loadConfig } from '@connector/config';

async function bootstrap() {
  setupObservability({ serviceName: 'bc-analysis' });
  const cfg = loadConfig('bc-analysis');
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.NATS,
    options: { servers: [cfg.natsUrl] },
  });
  await app.startAllMicroservices();
  await app.listen(cfg.port ?? 3030);
}
bootstrap();
