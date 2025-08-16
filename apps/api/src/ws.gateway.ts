import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'ws';
import { connect, StringCodec } from 'nats';

@WebSocketGateway({ path: '/ws', transports: [], cors: { origin: '*' } })
export class ApiWsGateway {
  @WebSocketServer() server!: Server;

  private sc = StringCodec();

  // This method runs on gateway init if needed (simplified)
  async afterInit() {
    // Bridge NATS ticks to WS clients (basic fan-out)
    const conn = await connect({ servers: process.env.NATS_URL || 'nats://localhost:4222' });
    const sub = await conn.subscribe('marketdata.ticks.>');
    (async () => {
      for await (const m of sub) {
        const json = this.sc.decode(m.data);
        this.server.clients.forEach((client: any) => {
          if (client.readyState === 1) client.send(json);
        });
      }
    })().catch(() => undefined);
  }

  @SubscribeMessage('ping')
  handlePing(): string {
    return 'pong';
  }
}
