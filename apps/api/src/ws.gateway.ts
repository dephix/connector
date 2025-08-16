import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { Server, WebSocket } from 'ws';
import { connect, StringCodec } from 'nats';

type Filters = { exchange?: string; symbol?: string };

@WebSocketGateway({ path: '/ws', transports: [], cors: { origin: '*' } })
export class ApiWsGateway implements OnGatewayConnection {
  @WebSocketServer() server!: Server;

  private sc = StringCodec();
  private filters = new WeakMap<WebSocket, Filters>();

  // This method runs on gateway init if needed (simplified)
  async afterInit() {
    // Bridge NATS ticks to WS clients (basic fan-out)
    const conn = await connect({
      servers: process.env.NATS_URL || 'nats://localhost:4222',
    });
    const sub = await conn.subscribe('marketdata.ticks.>');
    (async () => {
      for await (const m of sub) {
        const json = this.sc.decode(m.data);
        this.server.clients.forEach((client: any) => {
          if (client.readyState !== 1) return;
          const f = this.filters.get(client as WebSocket);
          if (!f) {
            client.send(json);
            return;
          }
          try {
            const obj = JSON.parse(json) as {
              exchangeId: string;
              symbol: string;
            };
            if (f.exchange && f.exchange !== obj.exchangeId) return;
            if (f.symbol && f.symbol !== obj.symbol) return;
            client.send(json);
          } catch {
            client.send(json);
          }
        });
      }
    })().catch(() => undefined);
  }

  @SubscribeMessage('ping')
  handlePing(): string {
    return 'pong';
  }

  handleConnection(client: WebSocket, req: any) {
    try {
      const url = new URL(req.url, `http://${req.headers.host}`);
      const exchange = url.searchParams.get('exchange') || undefined;
      const symbol = url.searchParams.get('symbol') || undefined;
      if (exchange || symbol) this.filters.set(client, { exchange, symbol });
    } catch {
      // ignore parsing errors, no filters applied
    }
  }
}
