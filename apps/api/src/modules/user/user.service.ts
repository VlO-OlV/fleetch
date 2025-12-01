import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from 'generated/prisma';
import { UserRepository } from 'src/database/repositories/user.repository';

@Injectable()
export class UserService {
  public constructor(private userRepository: UserRepository) {}

  public async findById(id: string) {
    const user = await this.userRepository.findOne({
      id,
    });

    if (!user) {
      throw new NotFoundException('User with such id not found');
    }

    return user;
  }

  public async findByEmail(email: string) {
    return this.userRepository.findOne({
      email,
    });
  }

  public async updateById(id: string, data: Prisma.UserUncheckedUpdateInput) {
    return this.userRepository.updateOne({ id }, { ...data });
  }

  public async findMany(
    query?: { page?: number; limit?: number } & Prisma.UserWhereInput,
  ) {
    const { page = 1, limit = 20, ...filters } = query || {};

    const where: Prisma.UserWhereInput = {} as any;
    if (filters.email) {
      where.email = {
        contains: filters.email as any,
        mode: 'insensitive',
      } as any;
    }
    if (filters.firstName) {
      where.firstName = {
        contains: filters.firstName as any,
        mode: 'insensitive',
      } as any;
    }
    if (filters.lastName) {
      where.lastName = {
        contains: filters.lastName as any,
        mode: 'insensitive',
      } as any;
    }

    const all = await this.userRepository.findMany(where);

    const take = limit;
    const skip = (page - 1) * take;

    return {
      data: all.slice(skip, skip + take),
      meta: {
        total: all.length,
        page,
        limit: take,
      },
    };
  }

  public async create(data: Prisma.UserUncheckedCreateInput) {
    return this.userRepository.create(data);
  }

  public async deleteById(id: string) {
    return this.userRepository.deleteOne({ id });
  }

  public async deleteMany(where: Prisma.UserWhereInput) {
    return this.userRepository.deleteMany(where);
  }
}
