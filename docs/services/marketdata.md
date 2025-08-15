# Service: marketdata

## Summary
- Purpose: ingest market data from exchanges (REST/WS), normalize and emit.
- Communications:
  - Connects to exchanges via adapters.
  - Emits events (planned): `marketdata.candles.ingested.v1`, `marketdata.ticks.ingested.v1`.
- Observability: pino logs, `/metrics`, OTEL traces.

## Environment variables
- `MARKETDATA_PORT` (overrides `PORT`) — default 3020
- `NATS_URL` — default `nats://localhost:4222`
- `OTEL_EXPORTER_OTLP_ENDPOINT` — default `http://localhost:4317`
- `LOG_LEVEL` — default `info`

## Run locally
```bash
pnpm run start:bc:marketdata
```
