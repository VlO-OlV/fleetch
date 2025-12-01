import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { RideClassByIdPipe } from 'src/common/pipes/ride-class-by-id.pipe';

import { CreateRideClassDto } from './dtos/create-ride-class.dto';
import { UpdateRideClassDto } from './dtos/update-ride-class.dto';
import { RideClassService } from './ride-class.service';

@Controller('ride-classes')
export class RideClassController {
  public constructor(private readonly rideClassService: RideClassService) {}

  @Get('/')
  public async getRideClasses() {
    return this.rideClassService.findMany();
  }

  @Get('/:id')
  public async getRideClassById(@Param('id', RideClassByIdPipe) id: string) {
    return this.rideClassService.findById(id);
  }

  @Post('/')
  public async createRideClass(@Body() dto: CreateRideClassDto) {
    return this.rideClassService.create(dto);
  }

  @Patch('/:id')
  public async updateRideClass(
    @Param('id', RideClassByIdPipe) id: string,
    @Body() dto: UpdateRideClassDto,
  ) {
    return this.rideClassService.updateById(id, dto);
  }

  @Delete('/:id')
  public async deleteRideClass(@Param('id', RideClassByIdPipe) id: string) {
    return this.rideClassService.deleteById(id);
  }
}
