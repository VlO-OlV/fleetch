import { Injectable, PipeTransform } from '@nestjs/common';
import { ExtraOptionService } from 'src/modules/extra-option/extra-option.service';

@Injectable()
export class ExtraOptionByIdPipe implements PipeTransform<string> {
  public constructor(private readonly extraOptionService: ExtraOptionService) {}

  async transform(id: string): Promise<string> {
    await this.extraOptionService.findById(id);
    return id;
  }
}
