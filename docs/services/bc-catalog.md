# Service: bc-catalog

## Summary
- Purpose: source of truth for exchanges and symbols (listing, metadata).
- Communications:
  - Handles requests: `catalog.exchanges.list`, `catalog.symbols.list`.
- Observability: pino logs, `/metrics`, OTEL traces.

## Message subjects
- `catalog.exchanges.list` (req/reply)
- `catalog.symbols.list` (req/reply)

## Environment variables
- `BC_CATALOG_PORT` (overrides `PORT`) — default 3010
- `NATS_URL` — default `nats://localhost:4222`
- `OTEL_EXPORTER_OTLP_ENDPOINT` — default `http://localhost:4317`
- `LOG_LEVEL` — default `info`

## Run locally
```bash
pnpm run start:bc:catalog
```
