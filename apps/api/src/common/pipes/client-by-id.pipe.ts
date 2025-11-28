import { Injectable, PipeTransform } from '@nestjs/common';
import { ClientService } from 'src/modules/client/client.service';

@Injectable()
export class ClientByIdPipe implements PipeTransform<string> {
  public constructor(private readonly clientService: ClientService) {}

  async transform(id: string): Promise<string> {
    await this.clientService.findById(id);
    return id;
  }
}
