import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class CreateDriverDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 20)
  firstName: string;

  @IsOptional()
  @IsString()
  @Length(1, 20)
  middleName?: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 20)
  lastName: string;

  @IsOptional()
  @IsString()
  @Length(3, 20)
  phoneNumber?: string;

  @IsNotEmpty()
  @IsString()
  carNumber: string;

  @IsNotEmpty()
  @IsString()
  rideClassId: string;
}
