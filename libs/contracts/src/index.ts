export type ExchangeId = string;
export type SymbolId = string;

// Marketdata ticks event
export interface TickIngestedV1 {
  exchangeId: ExchangeId;
  symbol: SymbolId;
  price: number;
  ts: number;
  version: 'v1';
}

// Subjects
export const subjects = {
  ticksIngested: (exchangeId: ExchangeId, symbol: SymbolId) =>
    `marketdata.ticks.${exchangeId}.${symbol}.v1`,
};
