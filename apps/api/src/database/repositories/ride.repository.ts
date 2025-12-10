import { Injectable } from '@nestjs/common';
import { Prisma } from 'generated/prisma';

import { PrismaService } from '../prisma.service';

@Injectable()
export class RideRepository {
  public constructor(private prisma: PrismaService) {}

  public async findOne(
    where: Prisma.RideWhereInput,
    tx?: Prisma.TransactionClient,
  ) {
    return (tx ?? this.prisma).ride.findFirst({
      where,
      include: {
        driver: true,
        operator: true,
        rideClass: true,
        client: true,
        rideExtraOptions: { include: { extraOption: true } },
        locations: true,
      },
    });
  }

  public async findMany(
    where: Prisma.RideWhereInput,
    take: number = 100,
    skip: number = 0,
    orderBy?: Prisma.RideOrderByWithRelationInput,
    tx?: Prisma.TransactionClient,
  ) {
    return (tx ?? this.prisma).ride.findMany({
      where,
      include: {
        driver: true,
        operator: true,
        rideClass: true,
        client: true,
      },
      take,
      skip,
    });
  }

  public async count(
    where: Prisma.RideWhereInput,
    tx?: Prisma.TransactionClient,
  ) {
    return (tx ?? this.prisma).ride.count({ where });
  }

  public async create(
    data: Prisma.RideUncheckedCreateInput,
    tx?: Prisma.TransactionClient,
  ) {
    return (tx ?? this.prisma).ride.create({ data });
  }

  public async updateOne(
    where: Prisma.RideWhereUniqueInput,
    data: Prisma.RideUncheckedUpdateInput,
    tx?: Prisma.TransactionClient,
  ) {
    return (tx ?? this.prisma).ride.update({
      where,
      data: { ...data },
    });
  }

  public async deleteOne(
    where: Prisma.RideWhereUniqueInput,
    tx?: Prisma.TransactionClient,
  ) {
    return (tx ?? this.prisma).ride.delete({ where });
  }

  public async deleteMany(
    where: Prisma.RideWhereInput,
    tx?: Prisma.TransactionClient,
  ) {
    return (tx ?? this.prisma).ride.deleteMany({ where });
  }
}
