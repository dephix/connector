import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { loadMarketdataConfig } from '@connector/config/marketdata';
import {
  BybitWsClient,
  BinanceWsClient,
  ExchangeWsClient,
  TickerMessage,
} from './ws-clients';
import WebSocket from 'ws';
import { NatsPublisher } from './nats-publisher';
import { loadConfig } from '@connector/config';

@Injectable()
export class MarketdataGateway implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(MarketdataGateway.name);
  private sockets: WebSocket[] = [];

  constructor(private readonly publisher: NatsPublisher) {}

  async onModuleInit() {
    const cfg = loadMarketdataConfig();
    const base = loadConfig('marketdata');
    await this.publisher.ensure(base.natsUrl);
    const clients: Record<string, ExchangeWsClient> = {
      bybit: new BybitWsClient(),
      binance: new BinanceWsClient(),
    };

    for (const exchange of cfg.exchanges) {
      const client = clients[exchange];
      if (!client) {
        this.logger.warn(`Unsupported exchange: ${exchange}`);
        continue;
      }
      for (const symbol of cfg.symbols) {
        const ws = client.connect(symbol, (msg) =>
          this.handleTicker(exchange, msg),
        );
        this.sockets.push(ws);
        this.logger.log(`Subscribed ${exchange}:${symbol}`);
      }
    }
  }

  onModuleDestroy() {
    for (const ws of this.sockets) {
      try {
        ws.close();
      } catch (err) {
        this.logger.warn(`ws.close error: ${String(err)}`);
      }
    }
    this.sockets = [];
  }

  // TODO: publish to NATS subject per symbol, or Redis stream, etc.
  private async handleTicker(exchange: string, msg: TickerMessage) {
    this.logger.debug(`[${exchange}] ${msg.symbol} -> ${msg.price}`);
    await this.publisher.publishTick({
      exchangeId: exchange,
      symbol: msg.symbol,
      price: msg.price,
      ts: msg.ts,
      version: 'v1',
    });
  }
}
