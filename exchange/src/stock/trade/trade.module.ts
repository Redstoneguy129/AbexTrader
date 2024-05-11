import { Module } from '@nestjs/common';
import { TradeService } from './trade.service';
import { TradeController } from './trade.controller';
import { PrismaService } from '../../prisma.service';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { AuthModule } from '../../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [TradeController],
  providers: [TradeService, PrismaService, AuthGuard],
})
export class TradeModule {}
