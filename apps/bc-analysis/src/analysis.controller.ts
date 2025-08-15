import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class AnalysisController {
  @MessagePattern('analysis.symbol.requested')
  analyzeSymbol(@Payload() data: { exchangeId: string; symbol: string }) {
    const score = Math.random();
    return { exchangeId: data.exchangeId, symbol: data.symbol, score };
  }
}
