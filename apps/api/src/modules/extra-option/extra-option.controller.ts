import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ExtraOptionByIdPipe } from 'src/common/pipes/extra-option-by-id.pipe';

import { CreateExtraOptionDto } from './dtos/create-extra-option.dto';
import { UpdateExtraOptionDto } from './dtos/update-extra-option.dto';
import { ExtraOptionService } from './extra-option.service';

@Controller('extra-options')
export class ExtraOptionController {
  public constructor(private readonly service: ExtraOptionService) {}

  @Get('/')
  public async getExtraOptions() {
    return this.service.findMany();
  }

  @Get('/:id')
  public async getExtraOptionById(
    @Param('id', ExtraOptionByIdPipe) id: string,
  ) {
    return this.service.findById(id);
  }

  @Post('/')
  public async createExtraOption(@Body() dto: CreateExtraOptionDto) {
    return this.service.create(dto);
  }

  @Patch('/:id')
  public async updateExtraOption(
    @Param('id', ExtraOptionByIdPipe) id: string,
    @Body() dto: UpdateExtraOptionDto,
  ) {
    return this.service.updateById(id, dto);
  }

  @Delete('/:id')
  public async deleteExtraOption(@Param('id', ExtraOptionByIdPipe) id: string) {
    return this.service.deleteById(id);
  }
}
