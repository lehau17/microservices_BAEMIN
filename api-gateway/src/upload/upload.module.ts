import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
@Module({
  imports: [
    ConfigModule,
    ServeStaticModule.forRoot({
      rootPath: '.',
    }),
    ClientsModule.register([
      {
        name: 'UPLOAD_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [
            `amqp://${process.env.RABBITMQ_USER || 'admin'}:${process.env.RABBITMQ_PASSWORD || '1234'}@${process.env.RABBITMQ_HOST || 'localhost'}:5672`,
          ],
          queue: 'upload_queue',
          queueOptions: {
            durable: false,
          },
          persistent: true,
        },
      },
    ]),
  ],
  controllers: [UploadController],
  providers: [UploadService, ConfigService],
})
export class UploadModule {}
