import { IsNotEmpty, IsString } from 'class-validator';

export class CreateExtraOptionDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}
