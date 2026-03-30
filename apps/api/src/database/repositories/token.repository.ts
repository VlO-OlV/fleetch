import { Injectable } from '@nestjs/common';
import { Prisma } from 'generated/prisma';

import { PrismaService } from '../prisma.service';

import { AbstractRepository } from './abstract.repository';

@Injectable()
export class TokenRepository extends AbstractRepository<
  'token',
  Prisma.TokenGetPayload<{}>
> {
  constructor(prisma: PrismaService) {
    super(prisma.token, 'token');
  }
}
