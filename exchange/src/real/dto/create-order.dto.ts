export class CreateOrderDto {
  type: 'BUY' | 'SELL';
  symbol: string;
  price: number;
  quantity: number;
  time: Date;
  filled: boolean;
}