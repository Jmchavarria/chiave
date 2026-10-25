import type { ExecutionContext } from '@nestjs/common';
import { createParamDecorator } from '@nestjs/common';
import type { ICurrentUser } from '../domain/interfaces/current-user.interface';

export const CurrentUser = createParamDecorator(
  (data: keyof ICurrentUser | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<{ user?: ICurrentUser }>();
    const user = request.user;

    return data ? user?.[data] : user;
  },
);
