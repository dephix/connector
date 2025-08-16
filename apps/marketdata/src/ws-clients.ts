import WebSocket, { MessageEvent } from 'ws';

export type TickerMessage = { symbol: string; price: number; ts: number };

export interface ExchangeWsClient {
  connect(symbol: string, onMessage: (msg: TickerMessage) => void): WebSocket;
}

export class BybitWsClient implements ExchangeWsClient {
  connect(symbol: string, onMessage: (msg: TickerMessage) => void): WebSocket {
    // Bybit public v5: wss://stream.bybit.com/v5/public/spot
    const url = 'wss://stream.bybit.com/v5/public/spot';
    const ws = new WebSocket(url);
    ws.on('open', () => {
      const topic = `tickers.${symbol}`;
      ws.send(JSON.stringify({ op: 'subscribe', args: [topic] }));
    });
    ws.on('message', (data: WebSocket.RawData) => {
      const text = data.toString();
      const msg: unknown = JSON.parse(text);
      if (
        typeof msg === 'object' &&
        msg !== null &&
        'topic' in msg &&
        typeof (msg as any).topic === 'string' &&
        (msg as any).topic.startsWith('tickers.') &&
        'data' in msg
      ) {
        const d = (msg as any).data as { lastPrice: string };
        const price = parseFloat(d.lastPrice);
        onMessage({ symbol, price, ts: Date.now() });
      }
    });
    return ws;
  }
}

export class BinanceWsClient implements ExchangeWsClient {
  connect(symbol: string, onMessage: (msg: TickerMessage) => void): WebSocket {
    // Binance: wss://stream.binance.com:9443/ws/<symbol>@ticker (symbol lowercase)
    const stream = symbol.toLowerCase() + '@ticker';
    const url = `wss://stream.binance.com:9443/ws/${stream}`;
    const ws = new WebSocket(url);
    ws.on('message', (data: WebSocket.RawData) => {
      const text = data.toString();
      const msg: unknown = JSON.parse(text);
      if (typeof msg === 'object' && msg !== null && 'c' in msg && 'E' in msg) {
        const price = parseFloat((msg as any).c as string);
        const ts = Number((msg as any).E);
        onMessage({ symbol, price, ts });
      }
    });
    return ws;
  }
}
