import { Injectable } from '@nestjs/common';
import { RealGateway } from './real/real.gateway';

@Injectable()
export class AppService {
  constructor(private readonly realGateway: RealGateway) {
  }

  getHello(): string {
    this.realGateway.server.emit('trades', { message: 'trades' });
    return 'Hello World!';
  }
}
