# Component Diagram (Ports & Adapters)

```mermaid
flowchart TB
  subgraph api
    API_C[HTTP Controllers]
    API_WS[WS Gateway (/ws)]
    API_MS[NATS Clients]
  end

  subgraph catalog
    CAT_CTRL[Message Handlers]
    CAT_APP[Application Layer]
    CAT_DOMAIN[Domain]
    CAT_REPO[Repository (infra)]
  end

  subgraph marketdata
    MD_GATEWAY[WS Gateway]
    MD_WS(Bybit/Binance WS Clients)
    MD_PUB[NATS Publisher]
  end

  subgraph analysis
    AN_CTRL[Message Handlers]
    AN_APP[Use Cases]
    AN_DOMAIN[Domain]
    AN_STORE[Cache/DB]
  end

  API_C --> API_MS
  API_WS --> API_MS
  API_MS <-->|request/reply| CAT_CTRL
  API_MS <-->|request/reply| AN_CTRL
  MD_WS --> MD_GATEWAY --> MD_PUB --> AN_CTRL
  CAT_CTRL --> CAT_APP --> CAT_DOMAIN
  AN_CTRL --> AN_APP --> AN_DOMAIN
  CAT_APP --> CAT_REPO
  AN_APP --> AN_STORE
```

Notes:
- API talks to `catalog` and `analysis` via NATS req/reply.
- `marketdata` ingests WS streams and publishes events to NATS.
- Each context separates domain/application/infrastructure.
