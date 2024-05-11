import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TradersModule } from '../traders/traders.module';
import { PrismaService } from '../prisma.service';

@Module({
  imports: [TradersModule],
  controllers: [AuthController],
  providers: [AuthService, PrismaService],
  exports: [AuthService],
})
export class AuthModule {}
