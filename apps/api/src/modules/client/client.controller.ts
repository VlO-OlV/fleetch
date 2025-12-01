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
import { ClientByIdPipe } from 'src/common/pipes/client-by-id.pipe';

import { ClientService } from './client.service';
import { ClientQueryDto } from './dtos/client-query.dto';
import { CreateClientDto } from './dtos/create-client.dto';
import { UpdateClientDto } from './dtos/update-client.dto';

@Controller('clients')
export class ClientController {
  public constructor(private readonly clientService: ClientService) {}

  @Get('/')
  public async getClients(@Query() query: ClientQueryDto) {
    return this.clientService.findMany(query);
  }

  @Get('/:id')
  public async getClientById(@Param('id', ClientByIdPipe) id: string) {
    return this.clientService.findById(id);
  }

  @Post('/')
  public async createClient(@Body() dto: CreateClientDto) {
    return this.clientService.create(dto);
  }

  @Patch('/:id')
  public async updateClient(
    @Param('id', ClientByIdPipe) id: string,
    @Body() dto: UpdateClientDto,
  ) {
    return this.clientService.updateById(id, dto);
  }

  @Delete('/:id')
  public async deleteClient(@Param('id', ClientByIdPipe) id: string) {
    return this.clientService.deleteById(id);
  }
}
