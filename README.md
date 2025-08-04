Connector is a layer of our strategy engine.

It receives data from markets (such as ByBit, Binance, Drift, etc.), pushes it to the outbox database, and then:
- moves the data to persistent storage (such as S3)
- adapts the data using an adapter and moves it to another outbox

The job uses the new outbox to:
- move data to the cache
- move data to the timeseries database
- move data to the message queue (MQ)

The MQ is used by other layers of our program and by the WebSocket (WS) server.

Here is scheme of data flow with monitoring & tracing:

```mermaid
flowchart TD
    subgraph Markets
        ByBit
        Binance
        Drift
        OKX
    end

    subgraph MonitoringAndTracing["Monitoring & Tracing"]
        Prometheus
        Grafana
        Jaeger
        Loki
    end

    subgraph CommandFlow["Command Flow"]
        ServiceLayer[Service Layer / API]
        CommandOutbox
        CommandProcessor
    end

    Markets -->|Data via WS| Listener
    Listener -->|Data via Transaction| OutboxDB

    OutboxDB -->|Move| PersistStorage[S3]
    OutboxDB -->|Adaptation| Adapter
    Adapter -->|Adapted Data| OutboxDB
    OutboxDB -->|To Cache| Cache
    OutboxDB -->|To Timeseries DB| TimeseriesDB
    OutboxDB -->|To MQ| MQ
    MQ -->|Usage| ExternalServices[External Services]
    MQ -->|Usage| WSServer[WS Server]

    Listener -->|Metrics| Prometheus
    Adapter -->|Metrics| Prometheus
    MQ -->|Metrics| Prometheus
    WSServer -->|Metrics| Prometheus
    CommandProcessor -->|Metrics| Prometheus
    ServiceLayer -->|Metrics| Prometheus

    Prometheus -->|Dashboards| Grafana
    Loki -->|Logs| Grafana
    Jaeger -->|Traces| Grafana

    Listener -->|Spans| Jaeger
    Adapter -->|Spans| Jaeger
    MQ -->|Spans| Jaeger
    CommandProcessor -->|Spans| Jaeger
    ServiceLayer -->|Spans| Jaeger

    Listener -->|Logs| Loki
    Adapter -->|Logs| Loki
    MQ -->|Logs| Loki
    WSServer -->|Logs| Loki
    CommandProcessor -->|Logs| Loki
    ServiceLayer -->|Logs| Loki

    ExternalServices -->|Command Request| ServiceLayer
    WSServer -->|Command Request| ServiceLayer
    ServiceLayer -->|Validated Command| CommandOutbox
    CommandOutbox -- Push Event --> CommandProcessor
    CommandOutbox -- Polling --> CommandProcessor
    CommandProcessor -->|API Call| Markets
    Markets -->|Command Response| Listener
```
