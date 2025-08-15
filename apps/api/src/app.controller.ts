import { Controller, Get, Inject, Query } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

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
  analyzeSymbol(@Query('exchangeId') exchangeId: string, @Query('symbol') symbol: string) {
    return this.analysis.send('analysis.symbol.requested', { exchangeId, symbol });
  }
}
