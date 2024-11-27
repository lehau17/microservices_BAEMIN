import { Controller, UploadedFile, UseInterceptors } from '@nestjs/common';
import {
  EventPattern,
  MessagePattern,
  Payload,
  RpcException,
} from '@nestjs/microservices';
import { UploadService } from './upload.service';
import { diskStorage } from 'multer';
import * as fs from 'fs';
import slugify from 'slugify';
@Controller()
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @MessagePattern('uploadFile')
  async handleFileUpload(@Payload() fileData: any) {
    const { originalname, buffer } = fileData;

    const fileBuffer = Buffer.from(buffer, 'base64');

    const folderPath = './uploads';
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }
    const filePath = `${folderPath}/${Date.now()}-${slugify(originalname)}`;
    fs.writeFileSync(filePath, fileBuffer);

    return filePath;
  }
}
