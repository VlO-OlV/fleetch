import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { RideByIdPipe } from 'src/common/pipes/ride-by-id.pipe';

import { CreateRideDto } from './dtos/create-ride.dto';
import { RideQueryDto } from './dtos/ride-query.dto';
import { UpdateRideDto } from './dtos/update-ride.dto';
import { RideService } from './ride.service';

@Controller('rides')
export class RideController {
  public constructor(private readonly rideService: RideService) {}

  @Get('/')
  public async getRides(@Query() query: RideQueryDto) {
    return this.rideService.findMany(query);
  }

  @Get('/:id')
  public async getRideById(@Param('id', RideByIdPipe) id: string) {
    return this.rideService.findById(id);
  }

  @Post('/')
  public async createRide(@Body() dto: CreateRideDto) {
    return this.rideService.create(dto);
  }

  @Patch('/:id')
  public async updateRide(
    @Param('id', RideByIdPipe) id: string,
    @Body() dto: UpdateRideDto,
  ) {
    return this.rideService.updateById(id, dto);
  }

  @Delete('/:id')
  public async deleteRide(@Param('id', RideByIdPipe) id: string) {
    return this.rideService.deleteById(id);
  }
}
