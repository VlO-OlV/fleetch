import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from 'generated/prisma';

import { ExtraOptionRepository } from '../../database/repositories/extra-option.repository';

import { CreateExtraOptionDto } from './dtos/create-extra-option.dto';
import { UpdateExtraOptionDto } from './dtos/update-extra-option.dto';

@Injectable()
export class ExtraOptionService {
  public constructor(
    private readonly extraOptionRepository: ExtraOptionRepository,
  ) {}

  public async findMany(
    where?: Prisma.ExtraOptionWhereInput,
    tx?: Prisma.TransactionClient,
  ) {
    const extraOptions = await this.extraOptionRepository.findMany(
      { ...(where || {}) },
      tx,
    );

    return {
      data: [...extraOptions],
    };
  }

  public async findById(id: string) {
    const extraOption = await this.extraOptionRepository.findOne({ id });

    if (!extraOption) {
      throw new NotFoundException('Extra option with such id not found');
    }

    return extraOption;
  }

  public async create(dto: CreateExtraOptionDto) {
    return this.extraOptionRepository.create({ ...dto });
  }

  public async updateById(id: string, dto: UpdateExtraOptionDto) {
    return this.extraOptionRepository.updateOne({ id }, { ...dto });
  }

  public async deleteById(id: string) {
    return this.extraOptionRepository.deleteOne({ id });
  }
}
