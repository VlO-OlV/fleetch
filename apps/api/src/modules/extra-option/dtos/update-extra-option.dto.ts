import { PartialType } from '@nestjs/mapped-types';

import { CreateExtraOptionDto } from './create-extra-option.dto';

export class UpdateExtraOptionDto extends PartialType(CreateExtraOptionDto) {}
