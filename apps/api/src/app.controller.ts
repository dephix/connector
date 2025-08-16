import { Controller, Get, Inject, Query } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { connect } from 'nats';

@Controller()
export class AppController {
  constructor(
    @Inject('CATALOG') private readonly catalog: ClientProxy,
    @Inject('ANALYSIS') private readonly analysis: ClientProxy,
  ) {}

  @Get('/exchanges')
  listExchanges() {
    return this.catalog.send('catalog.exchanges.list', {});
  }

  @Get('/symbols')
  listSymbols(@Query('exchangeId') exchangeId: string) {
    return this.catalog.send('catalog.symbols.list', { exchangeId });
  }

  @Get('/analysis/symbol')
  analyzeSymbol(
    @Query('exchangeId') exchangeId: string,
    @Query('symbol') symbol: string,
  ) {
    return this.analysis.send('analysis.symbol.requested', {
      exchangeId,
      symbol,
    });
  }

  @Get('/ticks')
  async getTicks(
    @Query('exchangeId') exchangeId: string,
    @Query('symbol') symbol: string,
    @Query('limit') limitStr?: string,
  ) {
    if (!exchangeId || !symbol)
      return { error: 'exchangeId and symbol are required' };
    const limit = Math.max(1, Math.min(50, Number(limitStr ?? '20')));
    const conn = await connect({
      servers: process.env.NATS_URL || 'nats://localhost:4222',
    });
    const jsm = await conn.jetstreamManager();
    const subject = `marketdata.ticks.${exchangeId}.${symbol}.v1`;
    const stream = await jsm.streams.find(subject);
    // Create or use durable consumer for filtered subject
    const durable = `api_ticks_${exchangeId}_${symbol}`;
    try {
      await jsm.consumers.info(stream, durable);
    } catch {
      await jsm.consumers.add(stream, {
        durable_name: durable,
        filter_subject: subject,
        ack_policy: 'explicit',
      } as any);
    }
    const js = conn.jetstream();
    const res: unknown[] = [];
    // Simplified: fetch last N messages directly from the stream (sequence-based)
    const si = await jsm.streams.getMessage(stream, { last_by_subj: subject } as any).catch(() => null);
    if (si && (si as any).data) {
      // direct last message
      try { res.push(JSON.parse(new TextDecoder().decode((si as any).data))); } catch {}
      await conn.drain();
      return res;
    }
    // Fallback to consumer pull (if getMessage not available)
    const durableName = `api_ticks_${exchangeId}_${symbol}`;
    const sub = await js.pullSubscribe(subject, { durable: (name: string) => name } as any);
    await sub.pull({ batch: limit, expires: 1000 });
    for await (const m of sub) {
      try {
        res.push(JSON.parse(new TextDecoder().decode(m.data)));
      } catch (_e) {
        // ignore malformed
      }
      m.ack();
      if (res.length >= limit) break;
    }
    await conn.drain();
    return res;
  }
}
