import { Injectable } from '@nestjs/common';
import { Prisma } from 'generated/prisma';

import { PrismaService } from '../prisma.service';

import { AbstractRepository } from './abstract.repository';

@Injectable()
export class ClientRepository extends AbstractRepository<
  'client',
  Prisma.ClientGetPayload<{ include: Prisma.ClientInclude }>
> {
  constructor(prisma: PrismaService) {
    super(prisma.client, 'client', {
      _count: {
        select: { rides: true },
      },
    });
  }
}
