import { Injectable, PipeTransform } from '@nestjs/common';
import { RideClassService } from 'src/modules/ride-class/ride-class.service';

@Injectable()
export class RideClassByIdPipe implements PipeTransform<string> {
  public constructor(private readonly rideClassService: RideClassService) {}

  async transform(id: string): Promise<string> {
    await this.rideClassService.findById(id);
    return id;
  }
}
