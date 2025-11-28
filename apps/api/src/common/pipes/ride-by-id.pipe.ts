import { Injectable, PipeTransform } from '@nestjs/common';
import { RideService } from 'src/modules/ride/ride.service';

@Injectable()
export class RideByIdPipe implements PipeTransform<string> {
  public constructor(private readonly rideService: RideService) {}

  async transform(id: string): Promise<string> {
    await this.rideService.findById(id);
    return id;
  }
}
