import { IncomingMessage } from 'http';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

const Header = createParamDecorator(
  (name: string, ctx: ExecutionContext): string | undefined => {
    const { headers } = ctx.switchToHttp().getRequest<IncomingMessage>();
    return headers[name] as string;
  },
);

export default Header;