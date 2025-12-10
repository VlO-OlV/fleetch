import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AdminGuard } from 'src/common/guards/admin/admin.guard';
import { JwtGuard } from 'src/common/guards/jwt/jwt.guard';
import { RideByIdPipe } from 'src/common/pipes/ride-by-id.pipe';

import { CreateRideDto } from './dtos/create-ride.dto';
import { RideQueryDto } from './dtos/ride-query.dto';
import { UpdateRideDto } from './dtos/update-ride.dto';
import { RideService } from './ride.service';

@UseGuards(JwtGuard)
@Controller('rides')
export class RideController {
  public constructor(private readonly rideService: RideService) {}

  @UseGuards(AdminGuard)
  @Get('/stats')
  public async getGeneralStats() {
    return this.rideService.getGeneralStats();
  }

  @UseGuards(AdminGuard)
  @Get('/stats/payment-type')
  public async getRidesByPaymentTypeStats() {
    return this.rideService.getRidesByPaymentTypeStats();
  }

  @UseGuards(AdminGuard)
  @Get('/stats/ride-class')
  public async getIncomeByRideClassStats() {
    return this.rideService.getIncomeByRideClassStats();
  }

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
