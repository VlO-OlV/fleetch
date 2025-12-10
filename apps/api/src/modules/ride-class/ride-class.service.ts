import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { RideClassRepository } from '../../database/repositories/ride-class.repository';

import { CreateRideClassDto } from './dtos/create-ride-class.dto';
import { UpdateRideClassDto } from './dtos/update-ride-class.dto';

@Injectable()
export class RideClassService {
  public constructor(
    private readonly rideClassRepository: RideClassRepository,
  ) {}

  public async findMany() {
    const rideClasses = await this.rideClassRepository.findMany({});

    return {
      data: [...rideClasses],
    };
  }

  public async findById(id: string) {
    const rideClass = await this.rideClassRepository.findOne({ id });

    if (!rideClass) {
      throw new NotFoundException('Ride class with such id not found');
    }

    return rideClass;
  }

  public async create(dto: CreateRideClassDto) {
    const rideClassesCount = await this.rideClassRepository.count({});

    if (rideClassesCount >= 20) {
      throw new BadRequestException('Cannot create more than 20 ride classes');
    }

    return this.rideClassRepository.create({ ...dto });
  }

  public async updateById(id: string, dto: UpdateRideClassDto) {
    return this.rideClassRepository.updateOne({ id }, { ...dto });
  }

  public async deleteById(id: string) {
    return this.rideClassRepository.deleteOne({ id });
  }
}
