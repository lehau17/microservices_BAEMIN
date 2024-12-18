import { ConfigService } from '@nestjs/config';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { UploadService } from './upload.service';
import * as fs from 'fs';
import slugify from 'slugify';
import {
  S3Client,
  PutObjectCommand,
  ObjectCannedACL,
} from '@aws-sdk/client-s3';

@Controller()
export class UploadController {
  private s3: S3Client;

  constructor(
    private readonly uploadService: UploadService,
    private readonly configService: ConfigService,
  ) {
    this.s3 = new S3Client({
      region: 'ap-southeast-1',
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_S3_ACCESS_KEY'),
        secretAccessKey: this.configService.get<string>('AWS_S3_SECRET_KEY'),
      },
    });
  }

  @MessagePattern('uploadFileS3')
  async handleFileUploadUsingS3(@Payload() file: any) {
    const { originalname } = file;

    return await this.s3_upload(
      file.buffer,
      this.configService.get<string>('AWS_S3_NAME'),
      originalname,
      file.mimetype,
    );
  }

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

  async s3_upload(file, bucket, name, mimetype) {
    const params = {
      Bucket: bucket,
      Key: new Date().getTime + slugify(name),
      Body: file,
      ContentType: mimetype,
    };

    try {
      const command = new PutObjectCommand(params);
      const response = await this.s3.send(command);
      return response;
    } catch (e) {
      console.error(e);
      throw new RpcException(e);
    }
  }
}
