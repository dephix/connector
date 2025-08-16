import { Injectable, Logger } from '@nestjs/common';
import { connect, NatsConnection, StringCodec, JetStreamClient } from 'nats';
import { subjects, TickIngestedV1 } from '@connector/contracts';

@Injectable()
export class NatsPublisher {
  private readonly logger = new Logger(NatsPublisher.name);
  private conn: NatsConnection | null = null;
  private js: JetStreamClient | null = null;
  private readonly sc = StringCodec();

  async ensure(natsUrl: string) {
    if (this.conn) return;
    this.conn = await connect({ servers: natsUrl, name: 'marketdata-publisher' });
    this.js = this.conn.jetstream();
    this.logger.log('Connected to NATS for publishing');
  }

  async publishTick(evt: TickIngestedV1) {
    if (!this.js) throw new Error('JetStream not initialized');
    const subject = subjects.ticksIngested(evt.exchangeId, evt.symbol);
    const payload = this.sc.encode(JSON.stringify(evt));
    await this.js.publish(subject, payload);
  }

  async close() {
    await this.conn?.drain();
    this.conn = null;
    this.js = null;
  }
}
