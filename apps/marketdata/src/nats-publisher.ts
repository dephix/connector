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
    this.conn = await connect({
      servers: natsUrl,
      name: 'marketdata-publisher',
    });
    this.js = this.conn.jetstream();
    this.logger.log('Connected to NATS for publishing');
    // Auto-provision stream for ticks
    try {
      const jsm = await this.conn.jetstreamManager();
      const subjects = ['marketdata.ticks.*.*.v1'];
      try {
        await jsm.streams.info('marketdata_ticks');
      } catch {
        await jsm.streams.add({
          name: 'marketdata_ticks',
          subjects,
          storage: 'file',
          retention: 'limits',
          max_age: 0, // no TTL by default; adjust as needed
        } as any);
        this.logger.log('Created JetStream stream marketdata_ticks');
      }
    } catch (err) {
      this.logger.warn(`JetStream provisioning error: ${String(err)}`);
    }
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
