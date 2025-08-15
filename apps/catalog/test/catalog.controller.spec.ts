import { CatalogController } from '../src/catalog.controller';

describe('CatalogController', () => {
  let controller: CatalogController;

  beforeEach(() => {
    controller = new CatalogController();
  });

  it('returns exchanges list', () => {
    const result = controller.listExchanges();
    expect(Array.isArray(result)).toBe(true);
    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 'bybit' }),
        expect.objectContaining({ id: 'binance' }),
      ]),
    );
  });

  it('returns symbols for bybit', () => {
    const symbols = controller.listSymbols({ exchangeId: 'bybit' });
    expect(symbols.length).toBeGreaterThan(0);
    expect(symbols[0]).toEqual(expect.objectContaining({ id: expect.any(String) }));
  });

  it('returns empty symbols for unknown exchange', () => {
    const symbols = controller.listSymbols({ exchangeId: 'unknown' });
    expect(symbols).toEqual([]);
  });
});
