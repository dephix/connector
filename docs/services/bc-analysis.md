# Service: bc-analysis

## Summary
- Purpose: compute analysis for symbols/exchanges using market data.
- Communications:
  - Handles requests: `analysis.symbol.requested` → returns analysis result.
  - Will subscribe to events: `marketdata.candles.ingested.v1` (planned).
- Observability: pino logs, `/metrics`, OTEL traces.

## Environment variables
- `BC_ANALYSIS_PORT` (overrides `PORT`) — default 3030
- `NATS_URL` — default `nats://localhost:4222`
- `OTEL_EXPORTER_OTLP_ENDPOINT` — default `http://localhost:4317`
- `LOG_LEVEL` — default `info`

## Run locally
```bash
pnpm run start:bc:analysis
```
