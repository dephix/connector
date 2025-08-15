import { z } from 'zod';
import dotenv from 'dotenv';

// Load .env once on first import
dotenv.config();

const schema = z.object({
  NATS_URL: z.string().default('nats://localhost:4222'),
  PORT: z.string().optional(),
  OTEL_EXPORTER_OTLP_ENDPOINT: z.string().default('http://localhost:4317'),
  LOG_LEVEL: z.string().default('info'),
});

function toEnvPrefix(serviceName: string): string {
  return serviceName.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase();
}

export function loadConfig(serviceName: string) {
  const env = schema.parse(process.env);
  const prefix = toEnvPrefix(serviceName);
  const specificPortVar = `${prefix}_PORT`;
  const portStr = (process.env[specificPortVar] as string | undefined) ?? env.PORT;
  return {
    natsUrl: env.NATS_URL,
    port: portStr ? Number(portStr) : undefined,
    otlpEndpoint: env.OTEL_EXPORTER_OTLP_ENDPOINT,
    logLevel: env.LOG_LEVEL,
  };
}
