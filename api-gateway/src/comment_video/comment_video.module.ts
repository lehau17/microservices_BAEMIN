import { Module } from '@nestjs/common';
import { CommentVideoService } from './comment_video.service';
import { CommentVideoController } from './comment_video.controller';

@Module({
  controllers: [CommentVideoController],
  providers: [CommentVideoService],
})
export class CommentVideoModule {}
