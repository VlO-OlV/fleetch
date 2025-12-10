import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from 'generated/prisma';

import { DriverRepository } from '../../database/repositories/driver.repository';

import { CreateDriverDto } from './dtos/create-driver.dto';
import { DriverQueryDto } from './dtos/driver-query.dto';
import { UpdateDriverDto } from './dtos/update-driver.dto';

@Injectable()
export class DriverService {
  public constructor(private readonly driverRepository: DriverRepository) {}

  public async findMany(query: DriverQueryDto) {
    const {
      page = 1,
      limit = 10,
      status,
      rideClassId,
      sortBy,
      sortOrder = 'asc',
    } = query;

    const where: Prisma.DriverWhereInput = {};
    if (status) {
      where.status = status;
    }
    if (rideClassId) {
      where.rideClassId = rideClassId;
    }
    if (query.search) {
      where.OR = [
        { firstName: { contains: query.search, mode: 'insensitive' } },
        { middleName: { contains: query.search, mode: 'insensitive' } },
        { lastName: { contains: query.search, mode: 'insensitive' } },
        { phoneNumber: { contains: query.search, mode: 'insensitive' } },
        { carNumber: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const drivers = await this.driverRepository.findMany(
      where,
      limit,
      (page - 1) * limit,
      sortBy
        ? {
            ...(sortBy === 'rideClassId'
              ? { rideClass: { name: sortOrder } }
              : { [sortBy]: sortOrder }),
          }
        : undefined,
    );
    const totalDrivers = await this.driverRepository.count(where);

    return {
      data: [...drivers],
      totalPages: Math.ceil(totalDrivers / limit),
      page,
      limit,
    };
  }

  public async findById(id: string) {
    const driver = await this.driverRepository.findOne({ id });

    if (!driver) {
      throw new NotFoundException('Driver with such id not found');
    }

    return driver;
  }
  public async count() {
    return this.driverRepository.count({});
  }

  public async create(dto: CreateDriverDto) {
    return this.driverRepository.create({ ...dto });
  }

  public async updateById(id: string, dto: UpdateDriverDto) {
    return this.driverRepository.updateOne({ id }, { ...dto });
  }

  public async deleteById(id: string) {
    return this.driverRepository.deleteOne({ id });
  }
}
