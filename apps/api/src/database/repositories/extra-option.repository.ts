import { Injectable } from '@nestjs/common';
import { Prisma } from 'generated/prisma';

import { PrismaService } from '../prisma.service';

@Injectable()
export class ExtraOptionRepository {
  public constructor(private prisma: PrismaService) {}

  public async findOne(
    where: Prisma.ExtraOptionWhereInput,
    tx?: Prisma.TransactionClient,
  ) {
    return (tx ?? this.prisma).extraOption.findFirst({ where });
  }

  public async findMany(
    where: Prisma.ExtraOptionWhereInput,
    tx?: Prisma.TransactionClient,
  ) {
    return (tx ?? this.prisma).extraOption.findMany({ where });
  }

  public async create(
    data: Prisma.ExtraOptionUncheckedCreateInput,
    tx?: Prisma.TransactionClient,
  ) {
    return (tx ?? this.prisma).extraOption.create({ data });
  }

  public async updateOne(
    where: Prisma.ExtraOptionWhereUniqueInput,
    data: Prisma.ExtraOptionUncheckedUpdateInput,
    tx?: Prisma.TransactionClient,
  ) {
    return (tx ?? this.prisma).extraOption.update({
      where,
      data: { ...data },
    });
  }

  public async deleteOne(
    where: Prisma.ExtraOptionWhereUniqueInput,
    tx?: Prisma.TransactionClient,
  ) {
    return (tx ?? this.prisma).extraOption.delete({ where });
  }

  public async deleteMany(
    where: Prisma.ExtraOptionWhereInput,
    tx?: Prisma.TransactionClient,
  ) {
    return (tx ?? this.prisma).extraOption.deleteMany({ where });
  }
}
