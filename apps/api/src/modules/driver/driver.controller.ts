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
import { DriverByIdPipe } from 'src/common/pipes/driver-by-id.pipe';

import { DriverService } from './driver.service';
import { CreateDriverDto } from './dtos/create-driver.dto';
import { DriverQueryDto } from './dtos/driver-query.dto';
import { UpdateDriverDto } from './dtos/update-driver.dto';

@Controller('drivers')
export class DriverController {
  public constructor(private readonly driverService: DriverService) {}

  @Get('/')
  public async getDrivers(@Query() query: DriverQueryDto) {
    return this.driverService.findMany(query);
  }

  @Get('/:id')
  public async getDriverById(@Param('id', DriverByIdPipe) id: string) {
    return this.driverService.findById(id);
  }

  @Post('/')
  public async createDriver(@Body() dto: CreateDriverDto) {
    return this.driverService.create(dto);
  }

  @Patch('/:id')
  public async updateDriver(
    @Param('id', DriverByIdPipe) id: string,
    @Body() dto: UpdateDriverDto,
  ) {
    return this.driverService.updateById(id, dto);
  }

  @Delete('/:id')
  public async deleteDriver(@Param('id', DriverByIdPipe) id: string) {
    return this.driverService.deleteById(id);
  }
}
