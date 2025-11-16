import {
  GetObjectCommand,
  PutObjectCommand,
  PutObjectCommandInput,
  S3Client,
} from '@aws-sdk/client-s3';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileRepository } from 'src/database/repositories/file.repository';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FileService {
  private s3Client: S3Client;

  constructor(
    private fileRepository: FileRepository,
    private configService: ConfigService,
  ) {
    this.s3Client = new S3Client({
      region: configService.get<string>('aws.region') as string,
      credentials: {
        accessKeyId: configService.get<string>('aws.accessKey') as string,
        secretAccessKey: configService.get<string>(
          'aws.secretAccessKey',
        ) as string,
      },
    });
  }

  public async uploadFile(file: Express.Multer.File): Promise<void> {
    const key = `${uuidv4()}-${new Date().toISOString().replaceAll(':', '')}`;
    const params: PutObjectCommandInput = {
      Bucket: this.configService.get<string>('aws.bucket'),
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    await this.s3Client.send(new PutObjectCommand(params));

    await this.fileRepository.create({
      key,
      type: file.mimetype,
      name: file.originalname,
    });
  }

  public async getFile(id: string): Promise<{
    file: Uint8Array<ArrayBufferLike>;
    contentType: string;
    fileName: string;
  }> {
    const fileMetadata = await this.fileRepository.findOne({ id });

    if (!fileMetadata) {
      throw new NotFoundException('File not found');
    }

    const command = new GetObjectCommand({
      Bucket: this.configService.get<string>('aws.bucket'),
      Key: fileMetadata.key,
    });
    const { Body: fileBody } = await this.s3Client.send(command);

    if (!fileBody) {
      throw new NotFoundException('File not found');
    }

    const file = await fileBody.transformToByteArray();
    return {
      file,
      contentType: fileMetadata.type,
      fileName: fileMetadata.name,
    };
  }
}
