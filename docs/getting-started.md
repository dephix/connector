# Getting Started

This guide explains how to run the system locally, which UIs to use for observability, and how to verify everything works.

## Overview

Apps (independent services):
- `api`: HTTP facade; talks to other services over NATS (request/reply)
- `catalog`: exchanges/symbol catalog
- `marketdata`: WS ingestion from exchanges (Bybit/Binance) and event publishing (currently logs, ready to extend)
- `analysis`: compute analysis for symbols/exchanges on request

Observability: Prometheus (/metrics), Jaeger (OpenTelemetry), structured logs via pino.

## Prerequisites
- Node.js 20+
- pnpm 10+ (or use `npx pnpm@10`)
- Docker + Docker Compose

## Quick start

1) Install dependencies:
```bash
pnpm install
```

2) Start infra (broker + observability):
```bash
docker compose -f ops/docker-compose.yml up -d
```

3) Start apps:
```bash
# Optional .env
# NATS_URL=nats://localhost:4222
# OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4317

pnpm run start:all
```

App ports:
- api: 3000
- catalog: 3010
- marketdata: 3020
- analysis: 3030

## Verify (HTTP)
```bash
# exchanges via catalog (over NATS)
curl http://localhost:3000/exchanges

# symbols for an exchange
curl "http://localhost:3000/symbols?exchangeId=bybit"

# symbol analysis
curl "http://localhost:3000/analysis/symbol?exchangeId=bybit&symbol=BTCUSDT"

# read last ticks from JetStream (requires running marketdata)
curl "http://localhost:3000/ticks?exchangeId=bybit&symbol=BTCUSDT&limit=10"
```

## Metrics & health
Each service exposes Prometheus metrics at `/:metrics`:
- API: http://localhost:3000/metrics
- Catalog: http://localhost:3010/metrics
- Marketdata: http://localhost:3020/metrics
- Analysis: http://localhost:3030/metrics

In Prometheus (http://localhost:9090):
- Status → Targets: verify all app targets are UP
- Example queries: `up`, `process_cpu_user_seconds_total`, `process_resident_memory_bytes`

## Tracing (Jaeger)
- Jaeger UI: http://localhost:16686
- In “Search” select Service: `api` (or `catalog`, `analysis`, `marketdata`) → Find Traces
- Trigger HTTP calls to generate traces

Ensure apps export to the Collector endpoint:
- Default: `OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4317`

## NATS monitoring
- NATS server monitoring: http://localhost:8222
- Useful endpoints (JSON):
  - `/varz` — server stats
  - `/connz` — active connections (clients)
  - `/subsz` — subscriptions
- You should see clients from `api`, `catalog`, `analysis`, `marketdata`; and subscriptions for `catalog.*`, `analysis.*`.

## Grafana (dashboards)
- URL: http://localhost:3001
- Default login: admin / admin (change on first login)
- Add Prometheus as a datasource:
  1. Connections → Add new data source → Prometheus
  2. URL: `http://prometheus:9090` (service name from docker compose)
  3. Save & test
- Create a simple dashboard:
  1. Dashboards → New → New dashboard → Add visualization → select Prometheus datasource
  2. Query examples: `up`, `process_cpu_user_seconds_total`
  3. Save dashboard

## Market data configuration & scaling
Configure exchanges and symbols via env (see `.env.example`):
```
MARKETDATA_EXCHANGES=bybit,binance
MARKETDATA_SYMBOLS=BTCUSDT,ETHUSDT
```
Horizontal scaling per symbol: run multiple `marketdata` instances with different `MARKETDATA_SYMBOLS` sets (e.g., one instance per symbol).

### WebSocket for external clients
- Connect to: `ws://localhost:3000/ws`
- Optional URL filters (query params): `?exchange=bybit&symbol=BTCUSDT`
- Messages are JSON conforming to `TickIngestedV1`:
  `{ "exchangeId": "bybit", "symbol": "BTCUSDT", "price": 123.45, "ts": 1700000000000, "version": "v1" }`

## Port 4317 conflict (OTLP)
By default, the OpenTelemetry Collector publishes gRPC on host port 4317. If your host already uses 4317:
1. Remap Collector ports in `ops/docker-compose.yml`:
```
otel-collector:
  ports:
    - "14317:4317"
    - "14318:4318"
```
2. Set the apps to use the remapped endpoint in `.env`:
```
OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:14317
```

Note: Jaeger’s OTLP (4317) is not published on the host; only the Collector’s 4317/4318 is used.

## Release (Docker)
Trigger a Docker release by pushing a tag:
```bash
git add package.json
git commit -m "chore(release): vX.Y.Z"
git tag vX.Y.Z
git push origin main --tags
```
The workflow publishes images to GHCR:
- ghcr.io/<owner>/<repo>:vX.Y.Z-api
- ghcr.io/<owner>/<repo>:vX.Y.Z-catalog
- ghcr.io/<owner>/<repo>:vX.Y.Z-marketdata
- ghcr.io/<owner>/<repo>:vX.Y.Z-analysis

## Coverage (CI)
- HTML coverage is uploaded as a Pages artifact. If GitHub Pages is enabled (and the repo variable `PAGES_ENABLED=true`), it will be deployed to Pages.
- Otherwise, download the `github-pages` artifact from the CI run.
