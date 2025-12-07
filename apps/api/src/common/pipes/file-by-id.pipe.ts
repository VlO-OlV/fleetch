import { Injectable, PipeTransform } from '@nestjs/common';
import { FileService } from 'src/modules/file/file.service';

@Injectable()
export class FileByIdPipe implements PipeTransform<string> {
  public constructor(private readonly fileService: FileService) {}

  async transform(id: string): Promise<string> {
    await this.fileService.getFileMetadataById(id);
    return id;
  }
}
