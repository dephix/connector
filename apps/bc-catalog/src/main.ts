import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { setupObservability } from '@connector/observability';
import { loadConfig } from '@connector/config';

async function bootstrap() {
  setupObservability({ serviceName: 'bc-catalog' });
  const cfg = loadConfig('bc-catalog');
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.NATS,
    options: { servers: [cfg.natsUrl] },
  });
  await app.startAllMicroservices();
  await app.listen(process.env.PORT ? Number(process.env.PORT) : 3010);
}
bootstrap();
