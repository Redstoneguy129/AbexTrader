import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class StockService {
  constructor(private readonly prismaService: PrismaService) {}

  async getStocks() {
    return this.prismaService.stock.findMany();
  }

  async getStockBySymbol(symbol: string) {
    return this.prismaService.stock.findUnique({ where: { symbol } });
  }

  async getStockValue(symbol: string) {
    const stock = await this.getStockBySymbol(symbol);
    return stock.price;
  }

  async getStockVolume(symbol: string) {
    const stock = await this.getStockBySymbol(symbol);
    return stock.volume;
  }

  async getStockMarketCap(symbol: string) {
    const stock = await this.getStockBySymbol(symbol);
    return stock.price * stock.volume;
  }
}
