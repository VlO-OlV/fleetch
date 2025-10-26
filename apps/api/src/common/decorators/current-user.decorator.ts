import { createParamDecorator } from '@nestjs/common';
import { User } from 'generated/prisma';

export type UserPayload = Omit<User, 'password'> & { tokenId?: string };

export type JwtPayload = { sub: string };

export const CurrentUser = createParamDecorator(
  (field: keyof Omit<User, 'password'> | undefined, context) => {
    const user: Omit<User, 'password'> = context
      .switchToHttp()
      .getRequest().user;
    return field ? user?.[field] : user;
  },
);
