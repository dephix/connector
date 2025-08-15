import { Module } from '@nestjs/common';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { ObservabilityModules } from '@connector/observability';

@Module({ imports: [...ObservabilityModules, PrometheusModule.register()] })
export class AppModule {}
