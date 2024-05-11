import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { WSAuthMiddleware } from '../auth/middleware/auth.middleware';
import { AuthService } from '../auth/auth.service';
import { PrismaService } from '../prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { StockValueDto } from './dto/stock-value.dto';

@WebSocketGateway(3001)
export class RealGateway implements OnGatewayInit, OnGatewayConnection { // Real-Time Gateway for Trades and others.
  constructor(private readonly authService: AuthService, private readonly prismaService: PrismaService) {
  }

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('orders')
  orders(data: CreateOrderDto) {}

  @SubscribeMessage('stocks')
  stocks(data: StockValueDto) {}

  afterInit(server: any): any {
    this.server.use(WSAuthMiddleware(this.authService, this.prismaService));
  }

  handleConnection(client: any, ...args): any {
    console.log('Client connected:', client.handshake.headers.authorization);
  }
}
