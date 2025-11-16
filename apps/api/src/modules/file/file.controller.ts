import {
  Controller,
  Get,
  Param,
  Post,
  StreamableFile,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtGuard } from 'src/common/guards/jwt/jwt.guard';

import { FileService } from './file.service';

@Controller('files')
export class FileController {
  public constructor(private fileService: FileService) {}

  @UseGuards(JwtGuard)
  @UseInterceptors(
    FileInterceptor('file', { limits: { fileSize: 21 * 1000 * 1000 } }),
  )
  @Post()
  public async uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.fileService.uploadFile(file);
  }

  @Get(':key')
  public async getFile(@Param('key') key: string) {
    const { file, contentType, fileName } = await this.fileService.getFile(key);

    return new StreamableFile(file, {
      type: contentType,
      disposition: `attachment; filename=${fileName}`,
    });
  }
}
