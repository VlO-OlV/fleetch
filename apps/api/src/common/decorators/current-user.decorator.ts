import { createParamDecorator } from '@nestjs/common';
import { User } from 'generated/prisma';

export const CurrentUser = createParamDecorator(
  (
    field:
      | (keyof Omit<User, 'password'> & { profilePicture?: string })
      | undefined,
    context,
  ) => {
    const user: Omit<User, 'password'> = context
      .switchToHttp()
      .getRequest().user;
    return field ? user?.[field] : user;
  },
);
