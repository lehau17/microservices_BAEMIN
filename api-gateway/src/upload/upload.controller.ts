import {
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UploadService } from './upload.service';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
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

    // Gửi dữ liệu file tới microservice
    return this.uploadService.upload(fileData);
  }

  @Post('uploadS3')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFileUsingS3(@UploadedFile() file: Express.Multer.File) {
    const fileData = {
      ...file,
      buffer: file.buffer.toString('base64'), // Encode buffer to base64
    };

    // Gửi dữ liệu file tới microservice
    return this.uploadService.uploadUsingS3(fileData);
  }
}
