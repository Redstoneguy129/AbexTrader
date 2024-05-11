import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { Order, Stock, Trader } from '@prisma/client';

@Injectable()
export class TradeService {
  constructor(private readonly prismaService: PrismaService) {
  }

  async getTrades(symbol: string, type?: 'BUY' | 'SELL', since?: Date) {
    return this.prismaService.order.findMany({
      where: {
        symbol,
        type,
        createdAt: {
          gte: (since || new Date(Date.now() - (7 * 24 * 60 * 60 * 1000))).toISOString(),
        },
      },
    });
  }

  async getTrade(symbol: string, id: string) {
    return this.prismaService.order.findUniqueOrThrow({ where: { id, symbol } });
  }

  async createTradeDto(symbol: string, trader: string, price: number, quantity: number, type: 'BUY' | 'SELL') {
    const stock = await this.prismaService.stock.findUniqueOrThrow({ where: { symbol } });
    const traderRecord = await this.prismaService.trader.findUniqueOrThrow({ where: { id: trader } });
    return this.createTrade(traderRecord, stock, price, quantity, type);
  }

  async createTrade(trader: Trader, stock: Stock, price: number, quantity: number, type: 'BUY' | 'SELL') {
    let resultOrder: Order;
    return async () => {
      switch (type) {
        case 'BUY':
          if (trader.balance >= price * quantity) {
            await this.prismaService.trader.update({
              where: {
                id: trader.id,
              },
              data: {
                balance: {
                  decrement: quantity * price,
                },
              },
            });
            const sellOrders = await this.prismaService.order.findMany({
              where: {
                symbol: stock.symbol,
                price: price,
                type: 'SELL',
                filledAt: new Date(0).toISOString(),
              },
            });
            let remainingQuantity = quantity;
            for (let order of sellOrders) {
              if (remainingQuantity <= 0) {
                break;
              }
              if (order.quantity <= remainingQuantity) {
                // If the order quantity is less than or equal to the remaining quantity, buy the whole order
                try {
                  const completeOrder = await this.prismaService.order.update({
                    where: {
                      id: order.id,
                    },
                    data: {
                      filledAt: new Date(Date.now()).toISOString(),
                    },
                  });
                  const updateTheirOwnership = await this.prismaService.ownership.update({
                    where: {
                      traderId_symbol: {
                        traderId: completeOrder.traderId,
                        symbol: completeOrder.symbol,
                      },
                    },
                    data: {
                      quantity: {
                        decrement: order.quantity,
                      },
                    },
                  });
                  await this.prismaService.trader.update({
                    where: {
                      id: updateTheirOwnership.traderId,
                    },
                    data: {
                      balance: {
                        increment: order.quantity * price,
                      },
                    },
                  });
                  remainingQuantity -= order.quantity;
                } catch (err) {
                  console.log(err);
                }
              } else {
                // If the order quantity is more than the remaining quantity, buy a part of the order
                let partialOrder = { ...order };
                partialOrder.quantity = remainingQuantity;
                try {
                  const completeOrder = await this.prismaService.order.update({
                    where: {
                      id: order.id,
                    },
                    data: {
                      quantity: partialOrder.quantity,
                      filledAt: new Date(Date.now()).toISOString(),
                    },
                  });
                  const recreateTheirOrder = await this.prismaService.order.create({
                    data: {
                      type: 'SELL',
                      price: price,
                      quantity: order.quantity - completeOrder.quantity,
                      symbol: completeOrder.symbol,
                      traderId: completeOrder.traderId,
                      filledAt: new Date(0).toISOString(),
                    },
                  });
                  await this.prismaService.ownership.update({
                    where: {
                      traderId_symbol: {
                        traderId: recreateTheirOrder.traderId,
                        symbol: recreateTheirOrder.symbol,
                      },
                    },
                    data: {
                      quantity: {
                        decrement: partialOrder.quantity,
                      },
                    },
                  });
                  remainingQuantity = 0;
                } catch (err) {
                  console.log(err);
                }
              }
            }
            resultOrder = await this.prismaService.order.create({
              data: {
                type: 'BUY',
                price: price,
                quantity: quantity - remainingQuantity,
                traderId: trader.id,
                symbol: stock.symbol,
                filledAt: new Date(Date.now()).toISOString(),
              },
            });
            if (remainingQuantity > 0) {
              resultOrder = await this.prismaService.order.create({
                data: {
                  type: 'BUY',
                  price: price,
                  quantity: remainingQuantity,
                  traderId: trader.id,
                  symbol: stock.symbol,
                  filledAt: new Date(0).toISOString(),
                },
              });
            }
            await this.prismaService.ownership.upsert({
              where: {
                traderId_symbol: {
                  traderId: trader.id,
                  symbol: stock.symbol,
                },
              },
              create: {
                symbol: stock.symbol,
                traderId: trader.id,
                quantity: quantity - remainingQuantity,
              },
              update: {
                quantity: {
                  increment: quantity - remainingQuantity,
                },
              },
            });
          } else {
            throw new UnauthorizedException();
          }
          return resultOrder;
        case 'SELL':
          const ownership = await this.prismaService.ownership.findFirst({
            where: {
              symbol: stock.symbol,
              traderId: trader.id,
            },
          });
          if (ownership.quantity >= quantity) {
            const buyOrders = await this.prismaService.order.findMany({
              where: {
                symbol: stock.symbol,
                price: price,
                type: 'BUY',
                filledAt: new Date(0).toISOString(),
              },
            });
            let remainingQuantity = quantity;
            for (let order of buyOrders) {
              if (remainingQuantity <= 0) {
                break;
              }
              if (order.quantity <= remainingQuantity) {
                try {
                  const completeOrder = await this.prismaService.order.update({
                    where: {
                      id: order.id,
                    },
                    data: {
                      filledAt: new Date(Date.now()).toISOString(),
                    },
                  });
                  await this.prismaService.ownership.update({
                    where: {
                      traderId_symbol: {
                        traderId: completeOrder.traderId,
                        symbol: completeOrder.symbol,
                      },
                    },
                    data: {
                      quantity: {
                        increment: order.quantity,
                      },
                    },
                  });
                  remainingQuantity -= order.quantity;
                } catch (err) {
                  console.log(err);
                }
              } else {
                let partialOrder = { ...order };
                partialOrder.quantity = remainingQuantity;
                try {
                  const completeOrder = await this.prismaService.order.update({
                    where: {
                      id: order.id,
                    },
                    data: {
                      quantity: partialOrder.quantity,
                      filledAt: new Date(Date.now()).toISOString(),
                    },
                  });
                  const recreateTheirOrder = await this.prismaService.order.create({
                    data: {
                      type: 'BUY',
                      price,
                      quantity: order.quantity - completeOrder.quantity,
                      symbol: completeOrder.symbol,
                      traderId: completeOrder.traderId,
                      filledAt: new Date(0).toISOString(),
                    },
                  });
                  await this.prismaService.ownership.update({
                    where: {
                      traderId_symbol: {
                        traderId: recreateTheirOrder.traderId,
                        symbol: recreateTheirOrder.symbol,
                      },
                    },
                    data: {
                      quantity: {
                        increment: partialOrder.quantity,
                      },
                    },
                  });
                  remainingQuantity = 0;
                } catch (err) {
                  console.log(err);
                }
              }
            }
            resultOrder = await this.prismaService.order.create({
              data: {
                type: 'SELL',
                price,
                quantity: quantity - remainingQuantity,
                traderId: trader.id,
                symbol: stock.symbol,
                filledAt: new Date(Date.now()).toISOString(),
              },
            });
            if (remainingQuantity > 0) {
              resultOrder = await this.prismaService.order.create({
                data: {
                  type: 'SELL',
                  price,
                  quantity: remainingQuantity,
                  traderId: trader.id,
                  symbol: stock.symbol,
                  filledAt: new Date(0).toISOString(),
                },
              });
            }
            await this.prismaService.ownership.upsert({
              where: {
                traderId_symbol: {
                  traderId: trader.id,
                  symbol: stock.symbol,
                },
              },
              create: {
                symbol: stock.symbol,
                traderId: trader.id,
                quantity: quantity - remainingQuantity,
              },
              update: {
                quantity: {
                  decrement: quantity - remainingQuantity,
                },
              },
            });
          } else {
            throw new UnauthorizedException();
          }
          return resultOrder;
        default:
          throw new InternalServerErrorException();
      }
    };

  }

  async cancelTrade(id: string) {
    const order = await this.prismaService.order.findUniqueOrThrow({ where: { id } });
    if (order.filledAt.toISOString() !== new Date(0).toISOString())
      throw new UnauthorizedException();
    await this.prismaService.order.delete({ where: { id } }); // Deleted
    await this.prismaService.trader.update({
      where: {
        id: order.traderId,
      },
      data: {
        balance: {
          increment: order.quantity * order.price,
        },
      },
    });
  }
}
