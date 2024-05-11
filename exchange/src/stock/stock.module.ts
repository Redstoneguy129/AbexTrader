import { Module } from '@nestjs/common';
import { StockService } from './stock.service';
import { StockController } from './stock.controller';
import { TradeModule } from './trade/trade.module';
import { PrismaService } from '../prisma.service';
import { TradeService } from './trade/trade.service';

@Module({
  imports: [TradeModule],
  controllers: [StockController],
  providers: [StockService, PrismaService, TradeService],
})
export class StockModule {}
