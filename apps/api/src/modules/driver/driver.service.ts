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
      firstName,
      lastName,
      phoneNumber,
      status,
    } = query;

    const where: Prisma.DriverWhereInput = {};
    if (firstName) {
      where.firstName = { contains: firstName, mode: 'insensitive' };
    }
    if (lastName) {
      where.lastName = { contains: lastName, mode: 'insensitive' };
    }
    if (phoneNumber) {
      where.phoneNumber = { contains: phoneNumber };
    }
    if (status) {
      where.status = status;
    }

    const drivers = await this.driverRepository.findMany(
      where,
      limit,
      (page - 1) * limit,
    );
    const totalDrivers = await this.driverRepository.count(where);

    return {
      data: [...drivers],
      total: totalDrivers,
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
