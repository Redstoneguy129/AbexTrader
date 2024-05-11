import { Injectable, UnauthorizedException } from '@nestjs/common';
import { TradersService } from '../traders/traders.service';
import { PrismaService } from '../prisma.service';
import { createId as cuid } from '@paralleldrive/cuid2';

@Injectable()
export class AuthService {
  constructor(private readonly tradersService: TradersService, private readonly prismaService: PrismaService) {}

  async signIn(token: string) {
    try {
      const trader = await this.prismaService.trader.findUniqueOrThrow({ where: { oneTimeToken: token } });
      const session = await this.prismaService.session.create({
        data: {
          traderId: trader.id,
          usedToken: token,
          //Expiry is set to 24 hours from now
          expiry: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        },
      }).then(session => this.prismaService.trader.update({
        where: { oneTimeToken: session.usedToken },
        data: { oneTimeToken: cuid() },
      }));
      console.log(session);
      return session.id;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  async findTraderById(id: string) {
    return this.tradersService.findTraderById(id);
  }
}
