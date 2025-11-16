import { User } from 'generated/prisma';

export type UserPayload = Omit<User, 'password'> & { tokenId?: string };

export type JwtPayload = { userId: string };

export type EmailOptions = {
  subject: string;
  to: string;
  message?: string;
};
