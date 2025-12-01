import { Injectable, PipeTransform } from '@nestjs/common';
import { DriverService } from 'src/modules/driver/driver.service';

@Injectable()
export class DriverByIdPipe implements PipeTransform<string> {
  public constructor(private readonly driverService: DriverService) {}

  async transform(id: string): Promise<string> {
    await this.driverService.findById(id);
    return id;
  }
}
