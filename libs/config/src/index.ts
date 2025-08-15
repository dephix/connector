import { z } from 'zod';

const schema = z.object({
  NATS_URL: z.string().default('nats://localhost:4222'),
  PORT: z.string().optional(),
  OTEL_EXPORTER_OTLP_ENDPOINT: z.string().default('http://localhost:4317'),
});

export function loadConfig(_serviceName: string) {
  const env = schema.parse(process.env);
  return {
    natsUrl: env.NATS_URL,
    port: env.PORT ? Number(env.PORT) : undefined,
    otlpEndpoint: env.OTEL_EXPORTER_OTLP_ENDPOINT,
  };
}
