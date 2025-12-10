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
import { FileByIdPipe } from 'src/common/pipes/file-by-id.pipe';

import { FileService } from './file.service';

@Controller('files')
export class FileController {
  public constructor(private fileService: FileService) {}

  @UseGuards(JwtGuard)
  @UseInterceptors(
    FileInterceptor('file', { limits: { fileSize: 5 * 1024 * 1024 } }),
  )
  @Post()
  public async uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.fileService.uploadFile(file);
  }

  @Get(':id')
  public async getFile(@Param('id', FileByIdPipe) id: string) {
    const { file, contentType, fileName } = await this.fileService.getFile(id);

    return new StreamableFile(file, {
      type: contentType,
      disposition: `attachment; filename=${fileName}`,
    });
  }
}
