# Service: API

## Summary
- Purpose: HTTP facade (REST/GraphQL candidate) for external clients.
- Communication: request/reply over NATS to bounded contexts.
- Observability: pino logs, `/metrics`, OTEL traces.

## Endpoints
- `GET /exchanges` → `catalog.exchanges.list`
- `GET /symbols?exchangeId=...` → `catalog.symbols.list`
- `GET /analysis/symbol?exchangeId=...&symbol=...` → `analysis.symbol.requested`

## Environment variables
- `API_PORT` (overrides `PORT`) — default 3000
- `NATS_URL` — default `nats://localhost:4222`
- `OTEL_EXPORTER_OTLP_ENDPOINT` — default `http://localhost:4317`
- `LOG_LEVEL` — default `info`

## Run locally
```bash
pnpm run start:api
```

