# Connector Monorepo (NestJS)

This repository contains a NestJS monorepo organized around independent bounded contexts that communicate asynchronously via a broker.

- Bounded contexts as apps:
  - `api`: REST API facade that fans out to BCs over NATS
  - `bc-catalog`: exchange/symbol catalog and lookups
  - `bc-marketdata`: ingestion adapters for exchanges (REST/WS), emits market data events
  - `bc-analysis`: computes analysis for symbols/exchanges upon requests or events
- Cross-cutting libs: `config`, `observability`, `contracts`.
- Observability included out of the box: structured logs (pino), Prometheus metrics, OpenTelemetry traces (OTLP → Collector → Jaeger).

## Quick start

```bash
pnpm install
cp .env.example .env
pnpm run compose:up
pnpm run start:all
```

Then check:
- API: `http://localhost:3000` (metrics at `/metrics`)
- Jaeger UI: `http://localhost:16686`
- Prometheus: `http://localhost:9090`
- Grafana: `http://localhost:3001`

## Configuration (.env)
See `.env.example`. You can set global variables and per-service ports:

```env
NATS_URL=nats://localhost:4222
OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4317
LOG_LEVEL=info
API_PORT=3000
BC_CATALOG_PORT=3010
BC_MARKETDATA_PORT=3020
BC_ANALYSIS_PORT=3030
```

## Documentation
- Architecture and Nest monorepo guide: see `docs/` for service‑level docs and usage.
- NestJS monorepo reference: https://docs.nestjs.com/cli/monorepo

