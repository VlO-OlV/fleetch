import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { LocationType } from 'generated/prisma';

export class CreateLocationDto {
  @IsNotEmpty()
  @IsNumber()
  latitude: number;

  @IsNotEmpty()
  @IsNumber()
  longitude: number;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsEnum(LocationType)
  type: LocationType;
}
