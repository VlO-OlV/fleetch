import { Injectable } from '@nestjs/common';
import { Prisma } from 'generated/prisma';

import { PrismaService } from '../prisma.service';

import { AbstractRepository } from './abstract.repository';

@Injectable()
export class RideClassRepository extends AbstractRepository<
  'rideClass',
  Prisma.RideClassGetPayload<{}>
> {
  constructor(prisma: PrismaService) {
    super(prisma.rideClass, 'rideClass');
  }
}
