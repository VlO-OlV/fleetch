import { Injectable } from '@nestjs/common';
import { Prisma } from 'generated/prisma';

import { PrismaService } from '../prisma.service';

import { AbstractRepository } from './abstract.repository';

@Injectable()
export class ExtraOptionRepository extends AbstractRepository<
  'extraOption',
  Prisma.ExtraOptionGetPayload<{ include: Prisma.ExtraOptionInclude }>
> {
  constructor(prisma: PrismaService) {
    super(prisma.extraOption, 'extraOption');
  }
}
