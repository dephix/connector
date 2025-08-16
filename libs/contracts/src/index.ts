// Place for message contracts (DTOs) and codecs. For now TS-only.
export type ListExchangesRequest = Record<string, never>;
export interface ExchangeDto {
  id: string;
  name: string;
}
export interface SymbolDto {
  id: string;
  base: string;
  quote: string;
}

export interface AnalyzeSymbolRequest {
  exchangeId: string;
  symbol: string;
}
export interface AnalyzeSymbolResult {
  exchangeId: string;
  symbol: string;
  score: number;
}
