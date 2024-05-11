export class StockValueDto {
  symbol: string;
  trading_high: number;
  trading_low: number;
  pivot: number;
  probable_high: number;
  probable_low: number;
  time: Date;
}

/*
Trading High (Yesterday Trading High + Yesterday Trading PIVOT /2)
Probable High (Trading Low + (Yesterday Trading High - Yesterday Trading Low))
Pivot (Trading High + Trading Low + 2)
Trading Low (Yesterday Trading Low + Yesterday Trading PIVOT /2)
Probable Low (Trading High + (Yesterday Trading High - Yesterday Trading Low))
 */