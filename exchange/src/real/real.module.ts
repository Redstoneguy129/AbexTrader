import { Module } from '@nestjs/common';
import { RealGateway } from './real.gateway';
import { AuthService } from '../auth/auth.service';
import { PrismaService } from '../prisma.service';
import { AuthModule } from '../auth/auth.module';
import { TradersService } from '../traders/traders.service';
import { TradersModule } from '../traders/traders.module';

@Module({
  imports: [AuthModule, TradersModule],
  providers: [TradersService, AuthService, PrismaService]
})
export class RealModule {}
