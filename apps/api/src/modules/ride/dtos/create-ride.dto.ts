import { Type } from 'class-transformer';
import {
  IsOptional,
  IsString,
  IsNumber,
  Min,
  IsNotEmpty,
  IsArray,
  ValidateNested,
  IsEnum,
} from 'class-validator';
import { PaymentType, RideStatus } from 'generated/prisma';

import { CreateLocationDto } from './create-location.dto';

export class CreateRideDto {
  @IsOptional()
  @IsString()
  operatorId?: string;

  @IsOptional()
  @IsString()
  clientId?: string;

  @IsOptional()
  @IsString()
  driverId?: string;

  @IsOptional()
  @IsEnum(RideStatus)
  status?: RideStatus;

  @IsOptional()
  @IsEnum(PaymentType)
  paymentType?: PaymentType;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  totalPrice: number;

  @IsNotEmpty()
  @IsString()
  rideClassId: string;

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateLocationDto)
  locations: CreateLocationDto[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  rideExtraOptionIds?: string[];
}
