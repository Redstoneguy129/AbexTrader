import { Controller, Delete, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { TradeService } from './trade.service';
import Header from '../../decorators/header.decorator';
import { MessageBody } from '@nestjs/websockets';
import { CreateTradeDto } from './dto/create-trade.dto';
import { AuthGuard } from '../../auth/guards/auth.guard';

@UseGuards(AuthGuard)
@Controller('trade')
export class TradeController {
  constructor(private readonly tradeService: TradeService) {}

  @Get()
  findAll(@Header("symbol") symbol: string, @Query('type') type?: "BUY"|"SELL", @Query('from') from?: string) {
    return this.tradeService.getTrades(symbol, type, new Date(from));
  }

  @Get(":id")
  findOne(@Header("symbol") symbol: string, @Param("id") id: string) {
    return this.tradeService.getTrade(symbol, id);
  }

  @Post()
  create(@Header("symbol") symbol: string, @MessageBody() body: CreateTradeDto) {
    return this.tradeService.createTradeDto(symbol, body.trader.id, body.price, body.quantity, body.type);
  }

  @Delete(":id")
  delete(@Param("id") id: string) {
    return this.tradeService.cancelTrade(id);
  }
}
