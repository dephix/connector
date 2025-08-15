import { AnalysisController } from '../src/analysis.controller';

describe('AnalysisController', () => {
  let controller: AnalysisController;

  beforeEach(() => {
    controller = new AnalysisController();
  });

  it('returns analysis result with score', () => {
    const res = controller.analyzeSymbol({ exchangeId: 'bybit', symbol: 'BTCUSDT' });
    expect(res).toEqual(
      expect.objectContaining({ exchangeId: 'bybit', symbol: 'BTCUSDT', score: expect.any(Number) }),
    );
  });
});
