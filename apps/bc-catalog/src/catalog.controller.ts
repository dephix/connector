import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class CatalogController {
  @MessagePattern('catalog.exchanges.list')
  listExchanges() {
    return [{ id: 'bybit', name: 'Bybit' }, { id: 'binance', name: 'Binance' }];
  }

  @MessagePattern('catalog.symbols.list')
  listSymbols(@Payload() data: { exchangeId: string }) {
    const { exchangeId } = data;
    if (exchangeId === 'bybit') {
      return [
        { id: 'BTCUSDT', base: 'BTC', quote: 'USDT' },
        { id: 'ETHUSDT', base: 'ETH', quote: 'USDT' },
      ];
    }
    if (exchangeId === 'binance') {
      return [
        { id: 'BTCUSDT', base: 'BTC', quote: 'USDT' },
        { id: 'SOLUSDT', base: 'SOL', quote: 'USDT' },
      ];
    }
    return [];
  }
}
