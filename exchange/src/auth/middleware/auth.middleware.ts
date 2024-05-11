import { Socket } from 'socket.io';
import { Trader } from '@prisma/client';
import { AuthService } from '../auth.service';
import { PrismaService } from '../../prisma.service';

export interface AuthSocket extends Socket {
  user: Trader;
}

export type SocketMiddleware = (socket: Socket, next: (err?: Error) => void) => void
export const WSAuthMiddleware = (authService: AuthService, prismaService: PrismaService): SocketMiddleware => {
  function extractTokenFromHeader(request: AuthSocket): string | undefined {
    const [type, token] = request.handshake.headers.authorization.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  return async (socket: AuthSocket, next) => {
    const sessionToken = extractTokenFromHeader(socket);
    if (!sessionToken) {
      return next({
        name: 'Unauthorized',
        message: 'Unauthorized',
      });
    }
    try {
      const session = await prismaService.session.findUniqueOrThrow({ where: { id: sessionToken } });
      const { oneTimeToken, ...trader } = await authService.findTraderById(session.traderId);
      // @ts-ignore
      socket.user = trader;
    } catch (error) {
      return next({
        name: 'Unauthorized',
        message: 'Unauthorized',
      });
    }
    return next();
  };
};
