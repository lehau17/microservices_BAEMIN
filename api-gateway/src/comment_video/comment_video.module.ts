import { Module } from '@nestjs/common';
import { CommentVideoService } from './comment_video.service';
import { CommentVideoController } from './comment_video.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'COMMENT_VIDEO_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [
            `amqp://${process.env.RABBITMQ_USER || 'admin'}:${process.env.RABBITMQ_PASSWORD || '1234'}@${process.env.RABBITMQ_HOST || 'localhost'}:5672`,
          ],
          queue: 'comment_video_queue',

          queueOptions: {
            durable: true,
          },
          persistent: false,
        },
      },
    ]),
  ],
  controllers: [CommentVideoController],
  providers: [CommentVideoService],
})
export class CommentVideoModule {}
