import { Trader } from '@prisma/client';

export class CreateTradeDto {
  type: "BUY"|"SELL";
  price: number;
  quantity: number;
  trader: Trader;
}