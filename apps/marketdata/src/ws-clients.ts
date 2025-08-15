import WebSocket from 'ws';

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
    ws.on('message', (data) => {
      try {
        const msg = JSON.parse(data.toString());
        if (msg?.topic?.startsWith('tickers.') && msg.data) {
          const price = parseFloat(msg.data.lastPrice);
          onMessage({ symbol, price, ts: Date.now() });
        }
      } catch {}
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
    ws.on('message', (data) => {
      try {
        const msg = JSON.parse(data.toString());
        if (msg?.c && msg?.E) {
          const price = parseFloat(msg.c);
          onMessage({ symbol, price, ts: msg.E });
        }
      } catch {}
    });
    return ws;
  }
}
