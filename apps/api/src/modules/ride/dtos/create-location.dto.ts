import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { LocationType } from 'generated/prisma';

export class CreateLocationDto {
  @IsNotEmpty()
  @IsNumber()
  latitude: number;

  @IsNotEmpty()
  @IsNumber()
  longitude: number;

  @IsNotEmpty()
  @IsEnum(LocationType)
  type: LocationType;
}
