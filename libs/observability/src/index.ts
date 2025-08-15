import { Logger } from 'nestjs-pino';
import { LoggerModule } from 'nestjs-pino';
import pino from 'pino';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc';
import { diag, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api';

let sdk: NodeSDK | null = null;

export function setupObservability(opts: { serviceName: string }) {
  if (!sdk) {
    diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.ERROR);
    const exporter = new OTLPTraceExporter();
    sdk = new NodeSDK({
      serviceName: opts.serviceName,
      traceExporter: exporter,
      instrumentations: [getNodeAutoInstrumentations()],
    });
    sdk.start();
    process.on('SIGTERM', () => { sdk?.shutdown(); });
    process.on('beforeExit', () => { sdk?.shutdown(); });
  }
}

export const ObservabilityModules = [
  LoggerModule.forRoot({
    pinoHttp: {
      transport: process.env.NODE_ENV !== 'production' ? { target: 'pino-pretty' } : undefined,
      level: process.env.LOG_LEVEL || 'info',
    },
  }),
];
