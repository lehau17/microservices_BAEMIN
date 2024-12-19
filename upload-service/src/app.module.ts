import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UploadModule } from './upload/upload.module';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from 'aws-sdk';

@Module({
  imports: [UploadModule, ConfigModule.forRoot({ isGlobal: true })],
  controllers: [AppController],
  providers: [AppService, ConfigService],
})
export class AppModule {}
