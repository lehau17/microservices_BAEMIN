import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { handleRetryWithBackoff } from 'src/common/utils/handlerTimeoutWithBackoff';

@Injectable()
export class UploadService {
  constructor(@Inject('UPLOAD_SERVICE') private uploadService: ClientProxy) {}

  upload(file: any) {
    return lastValueFrom(
      this.uploadService
        .send('uploadFile', file)
        .pipe(handleRetryWithBackoff(3, 1000)),
    );
  }

  uploadUsingS3(file: any) {
    return lastValueFrom(
      this.uploadService
        .send('uploadFileS3', file)
        .pipe(handleRetryWithBackoff(3, 1000)),
    );
  }
}
