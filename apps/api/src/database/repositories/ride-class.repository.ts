import { Injectable } from '@nestjs/common';
import { Prisma } from 'generated/prisma';

import { PrismaService } from '../prisma.service';

@Injectable()
export class RideClassRepository {
  public constructor(private prisma: PrismaService) {}

  public async findOne(
    where: Prisma.RideClassWhereInput,
    tx?: Prisma.TransactionClient,
  ) {
    return (tx ?? this.prisma).rideClass.findFirst({ where });
  }

  public async findMany(
    where: Prisma.RideClassWhereInput,
    tx?: Prisma.TransactionClient,
  ) {
    return (tx ?? this.prisma).rideClass.findMany({
      where,
      orderBy: { priceCoefficient: 'asc' },
    });
  }

  public async count(
    where: Prisma.RideClassWhereInput,
    tx?: Prisma.TransactionClient,
  ) {
    return (tx ?? this.prisma).rideClass.count({ where });
  }

  public async create(
    data: Prisma.RideClassUncheckedCreateInput,
    tx?: Prisma.TransactionClient,
  ) {
    return (tx ?? this.prisma).rideClass.create({ data });
  }

  public async updateOne(
    where: Prisma.RideClassWhereUniqueInput,
    data: Prisma.RideClassUncheckedUpdateInput,
    tx?: Prisma.TransactionClient,
  ) {
    return (tx ?? this.prisma).rideClass.update({
      where,
      data: { ...data },
    });
  }

  public async deleteOne(
    where: Prisma.RideClassWhereUniqueInput,
    tx?: Prisma.TransactionClient,
  ) {
    return (tx ?? this.prisma).rideClass.delete({ where });
  }

  public async deleteMany(
    where: Prisma.RideClassWhereInput,
    tx?: Prisma.TransactionClient,
  ) {
    return (tx ?? this.prisma).rideClass.deleteMany({ where });
  }
}
