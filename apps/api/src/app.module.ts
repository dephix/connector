import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { loadConfig } from '@connector/config';
import { ObservabilityModules } from '@connector/observability';
import { ApiWsGateway } from './ws.gateway';

const cfg = loadConfig('api');

const wsProviders = process.env.NODE_ENV === 'test' ? [] : [ApiWsGateway];

@Module({
  imports: [
    ...ObservabilityModules,
    PrometheusModule.register(),
    ClientsModule.register([
      {
        name: 'CATALOG',
        transport: Transport.NATS,
        options: { servers: [cfg.natsUrl] },
      },
      {
        name: 'ANALYSIS',
        transport: Transport.NATS,
        options: { servers: [cfg.natsUrl] },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [...wsProviders],
})
export class AppModule {}
