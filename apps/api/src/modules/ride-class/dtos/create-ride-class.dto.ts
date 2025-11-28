import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateRideClassDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNumber()
  @Min(0)
  priceCoefficient: number;
}
