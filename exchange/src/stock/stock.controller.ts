import { Controller, Get } from '@nestjs/common';
import { StockService } from './stock.service';

@Controller('stock')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Get()
  findAll() {
    return this.stockService.getStocks();
  }

  @Get(":symbol")
  findOne(symbol: string) {
    return this.stockService.getStockBySymbol(symbol);
  }

  @Get(":symbol/value")
  findValue(symbol: string) {
    return this.stockService.getStockValue(symbol);
  }

  @Get(":symbol/volume")
  findVolume(symbol: string) {
    return this.stockService.getStockVolume(symbol);
  }

  @Get(":symbol/marketcap")
  findMarketCap(symbol: string) {
    return this.stockService.getStockMarketCap(symbol);
  }
}
