import { Module } from '@nestjs/common';
import { AnalysisController } from './analysis.controller';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { ObservabilityModules } from '@connector/observability';

@Module({
  imports: [...ObservabilityModules, PrometheusModule.register()],
  controllers: [AnalysisController],
})
export class AppModule {}
