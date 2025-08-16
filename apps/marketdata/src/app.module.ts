import { Module } from '@nestjs/common';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { ObservabilityModules } from '@connector/observability';
import { MarketdataGateway } from './gateway';
import { NatsPublisher } from './nats-publisher';

@Module({
  imports: [...ObservabilityModules, PrometheusModule.register()],
  providers: [MarketdataGateway, NatsPublisher],
})
export class AppModule {}
