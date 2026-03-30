import { PrismaClient } from '@prisma/client';
import { Prisma } from 'generated/prisma';

export type Models = Prisma.TypeMap['meta']['modelProps'];

export abstract class AbstractRepository<
  Model extends Models,
  Dto,
  Where = Prisma.TypeMap['model'][Capitalize<Model>]['operations']['findFirst']['args']['where'],
  Sort = Prisma.TypeMap['model'][Capitalize<Model>]['operations']['findFirst']['args']['orderBy'],
  Create = Prisma.TypeMap['model'][Capitalize<Model>]['operations']['create']['args']['data'],
  Update = Prisma.TypeMap['model'][Capitalize<Model>]['operations']['update']['args']['data'],
  WhereUnique = Prisma.TypeMap['model'][Capitalize<Model>]['operations']['findUnique']['args']['where'],
> {
  protected constructor(
    protected readonly model: (typeof PrismaClient.prototype)[Model],
    protected readonly modelName: Model,
    private readonly include?: Prisma.TypeMap['model'][Capitalize<Model>]['operations']['findFirst']['args']['include'],
  ) {}

  protected getModel(
    tx?: Prisma.TransactionClient,
  ): (typeof PrismaClient.prototype)[Model] {
    return tx ? tx[this.modelName] : this.model;
  }

  public async findMany(
    where: Where,
    take: number = 100,
    skip: number = 0,
    orderBy?: Sort,
    tx?: Prisma.TransactionClient,
  ): Promise<Dto[]> {
    return this.getModel(tx).findMany({
      where,
      include: this.include,
      orderBy,
      take,
      skip,
    });
  }

  public async findOne(
    where: Where,
    tx?: Prisma.TransactionClient,
  ): Promise<Dto> {
    return this.getModel(tx).findFirst({
      where,
      include: this.include,
    });
  }

  public async create(
    data: Create,
    tx?: Prisma.TransactionClient,
  ): Promise<Dto> {
    return this.getModel(tx).create({ data, include: this.include });
  }

  public async updateOne(
    where: Where,
    data: Update,
    tx?: Prisma.TransactionClient,
  ): Promise<Dto> {
    return this.getModel(tx).updateMany({
      where,
      data,
    });
  }

  public async deleteMany(
    where: Where,
    tx?: Prisma.TransactionClient,
  ): Promise<number> {
    return this.getModel(tx).deleteMany({ where });
  }

  public async deleteOne(
    where: Where,
    tx?: Prisma.TransactionClient,
  ): Promise<Dto> {
    return this.getModel(tx).delete({
      where,
      include: this.include,
    });
  }

  public async count(
    where: Where,
    tx?: Prisma.TransactionClient,
  ): Promise<number> {
    return this.getModel(tx).count({ where });
  }

  public async upsert(
    where: WhereUnique,
    create: Create,
    update: Update,
    tx?: Prisma.TransactionClient,
  ): Promise<Dto> {
    return this.getModel(tx).upsert({ where, update, create });
  }
}
