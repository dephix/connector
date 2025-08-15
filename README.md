# Connector Monorepo (NestJS)

[![CI](https://github.com/dephix/connector/actions/workflows/ci.yml/badge.svg)](https://github.com/dephix/connector/actions/workflows/ci.yml)
[![Node.js](https://img.shields.io/badge/node-22.x-brightgreen)](https://nodejs.org)
[![pnpm](https://img.shields.io/badge/pnpm-10.x-orange)](https://pnpm.io)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

This repository contains a NestJS monorepo organized around independent bounded contexts that communicate asynchronously via a broker.

- Bounded contexts as apps:
  - `api`: REST API facade that fans out to BCs over NATS
  - `catalog`: exchange/symbol catalog and lookups
  - `marketdata`: ingestion adapters for exchanges (REST/WS), emits market data events
  - `analysis`: computes analysis for symbols/exchanges upon requests or events
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
CATALOG_PORT=3010
MARKETDATA_PORT=3020
ANALYSIS_PORT=3030
```

## Status & CI

[![CI](https://github.com/dephix/connector/actions/workflows/ci.yml/badge.svg)](https://github.com/dephix/connector/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## Documentation

- Service docs live in `docs/`.
- Monorepo reference: https://docs.nestjs.com/cli/monorepo
