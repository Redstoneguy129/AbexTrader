import { Module } from '@nestjs/common';
import { TradersService } from './traders.service';
import { PrismaService } from '../prisma.service';
import { RealGateway } from '../real/real.gateway';
import { AuthService } from '../auth/auth.service';
import { RealModule } from '../real/real.module';

@Module({
  providers: [TradersService, PrismaService, RealGateway, AuthService],
  exports: [TradersService],
})
export class TradersModule {}
