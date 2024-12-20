import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UploadService } from './upload.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const fileData = {
      ...file,
      buffer: file.buffer.toString('base64'), // Encode buffer to base64
    };

    return this.uploadService.upload(fileData);
  }

  @Post('uploadS3')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFileUsingS3(@UploadedFile() file: Express.Multer.File) {
    const fileData = {
      ...file,
      buffer: file.buffer.toString('base64'), // Encode buffer to base64
    };

    return this.uploadService.uploadUsingS3(fileData);
  }
}
