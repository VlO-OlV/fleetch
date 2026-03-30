import { Injectable } from '@nestjs/common';
import { Prisma } from 'generated/prisma';

import { PrismaService } from '../prisma.service';

import { AbstractRepository } from './abstract.repository';

@Injectable()
export class UserRepository extends AbstractRepository<
  'user',
  Prisma.UserGetPayload<{}>
> {
  constructor(prisma: PrismaService) {
    super(prisma.user, 'user');
  }
}
