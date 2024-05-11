import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class TasksService {
  constructor(private readonly prismaService: PrismaService) {}

  // Delete expired sessions every 5 minutes
  @Cron('*/5 * * * *')
  sessionCleanup() {
    return this.prismaService.session.deleteMany({
      where: {
        expiry: {
          gte: new Date(Date.now()).toISOString(),
        },
      },
    });
  }

  // Delete orders if not filled after 5 days
  @Cron('*/15 * * * *')
  async orderCleanup() {
    const orders = await this.prismaService.order.findMany({ where: { filledAt: new Date(0).toISOString() } });
    const expiredOrders = orders.filter(order => new Date(order.createdAt).getTime() + 5 * 24 * 60 * 60 * 1000 < Date.now());
    for (const order of expiredOrders) {
      await this.prismaService.order.delete({ where: { id: order.id } });
    }
  }
}
