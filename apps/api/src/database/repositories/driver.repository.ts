import { Injectable } from '@nestjs/common';
import { Prisma } from 'generated/prisma';

import { PrismaService } from '../prisma.service';

import { AbstractRepository } from './abstract.repository';

@Injectable()
export class DriverRepository extends AbstractRepository<
  'driver',
  Prisma.DriverGetPayload<{ include: Prisma.DriverInclude }>
> {
  constructor(prisma: PrismaService) {
    super(prisma.driver, 'driver', {
      rideClass: true,
    });
  }
}
