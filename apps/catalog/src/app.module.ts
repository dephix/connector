import { Module } from '@nestjs/common';
import { CatalogController } from './catalog.controller';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { ObservabilityModules } from '@connector/observability';

@Module({
  imports: [...ObservabilityModules, PrometheusModule.register()],
  controllers: [CatalogController],
})
export class AppModule {}
