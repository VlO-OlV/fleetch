import { Injectable } from '@nestjs/common';
import { Prisma } from 'generated/prisma';

import { PrismaService } from '../prisma.service';

import { AbstractRepository } from './abstract.repository';

@Injectable()
export class RideRepository extends AbstractRepository<
  'ride',
  Prisma.RideGetPayload<{
    include: Omit<Prisma.RideInclude, 'rideExtraOptions'> & {
      rideExtraOptions: { include: { extraOption: true } };
    };
  }>
> {
  constructor(prisma: PrismaService) {
    super(prisma.ride, 'ride', {
      driver: true,
      operator: true,
      rideClass: true,
      client: true,
      rideExtraOptions: { include: { extraOption: true } },
      locations: true,
    });
  }
}
