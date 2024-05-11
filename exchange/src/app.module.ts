import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TradersModule } from './traders/traders.module';
import { TasksModule } from './tasks/tasks.module';
import { RealModule } from './real/real.module';
import { AuthService } from './auth/auth.service';
import { RealGateway } from './real/real.gateway';
import { PrismaService } from './prisma.service';
import { StockModule } from './stock/stock.module';
import { DiscordModule } from './discord/discord.module';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';

@Module({
  imports: [AuthModule, TradersModule, TasksModule, RealModule, StockModule, DiscordModule, ConfigModule.forRoot({
    isGlobal: true,
    cache: true,
    load: [configuration],
  })],
  controllers: [AppController],
  providers: [AppService, RealGateway, AuthService, PrismaService],
})
export class AppModule {
}
