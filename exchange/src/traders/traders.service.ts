import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { RealGateway } from '../real/real.gateway';

@Injectable()
export class TradersService {
  constructor(private readonly prismaService: PrismaService) {

  }

  async getTraders() {
    return this.prismaService.trader.findMany();
  }

  async findTraderById(id: string) {
    return this.prismaService.trader.findUniqueOrThrow({ where: { id } });
  }
}
