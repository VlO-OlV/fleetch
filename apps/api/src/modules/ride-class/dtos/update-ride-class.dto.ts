import { PartialType } from '@nestjs/mapped-types';

import { CreateRideClassDto } from './create-ride-class.dto';

export class UpdateRideClassDto extends PartialType(CreateRideClassDto) {}
