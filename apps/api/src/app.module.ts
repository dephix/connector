import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { loadConfig } from '@connector/config';
import { ObservabilityModules } from '@connector/observability';

const cfg = loadConfig('api');

@Module({
  imports: [
    ...ObservabilityModules,
    PrometheusModule.register(),
    ClientsModule.register([
      { name: 'CATALOG', transport: Transport.NATS, options: { servers: [cfg.natsUrl] } },
      { name: 'ANALYSIS', transport: Transport.NATS, options: { servers: [cfg.natsUrl] } },
    ]),
  ],
  controllers: [AppController],
})
export class AppModule {}
