import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const schema = z.object({
  MARKETDATA_EXCHANGES: z.string().default('bybit,binance'),
  MARKETDATA_SYMBOLS: z.string().default('BTCUSDT,ETHUSDT'),
});

export type MarketdataConfig = {
  exchanges: string[];
  symbols: string[];
};

export function loadMarketdataConfig(): MarketdataConfig {
  const env = schema.parse(process.env);
  const exchanges = env.MARKETDATA_EXCHANGES.split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  const symbols = env.MARKETDATA_SYMBOLS.split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  return { exchanges, symbols };
}
