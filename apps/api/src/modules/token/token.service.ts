import { Injectable } from '@nestjs/common';
import { Prisma } from 'generated/prisma';
import { TokenRepository } from 'src/database/repositories/token.repository';

@Injectable()
export class TokenService {
  public constructor(private tokenRepository: TokenRepository) {}

  public async findMany(where: Prisma.TokenWhereInput) {
    return this.tokenRepository.findMany({
      ...where,
    });
  }

  public async create(data: Prisma.TokenUncheckedCreateInput) {
    return this.tokenRepository.create({ ...data });
  }

  public async updateById(id: string, data: Prisma.TokenUncheckedUpdateInput) {
    return this.tokenRepository.updateOne({ id }, { ...data });
  }

  public async deleteById(id: string) {
    return this.tokenRepository.deleteOne({ id });
  }

  public async deleteMany(where: Prisma.TokenWhereInput) {
    return (this, this.tokenRepository.deleteMany({ ...where }));
  }
}
