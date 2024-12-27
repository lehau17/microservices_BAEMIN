import { PagingDto } from 'src/common/dto/paging.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { comment_videos, Prisma } from '@prisma/client';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { VideoDto } from 'src/common/dto/video.dto';
import { handleRetryWithBackoff } from 'src/common/utils/handlerTimeoutWithBackoff';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class CommentService {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject('SHORT_VIDEO_SERVICE')
    private readonly shortVideoService: ClientProxy,
  ) {}

  @Cron(CronExpression.EVERY_10_MINUTES) // Dạng cron: phút giờ ngày tháng ngày_trong_tuần
  async updateTotalCommentReplies() {
    try {
      // Tính tổng số bình luận con và cập nhật vào parent
      await this.prismaService.$executeRawUnsafe(`
        WITH CommentCounts AS (
          SELECT 
            parent_id,
            COUNT(*) AS total_comments
          FROM 
            comment_videos
          WHERE 
            parent_id IS NOT NULL
          GROUP BY 
            parent_id
        )
        UPDATE comment_videos
        SET 
          total_comment_reply = COALESCE(cc.total_comments, 0)
        FROM 
          CommentCounts cc
        WHERE 
          comment_videos.id = cc.parent_id;
      `);

      // Đặt total_comment_reply = 0 cho các bình luận không có con
      await this.prismaService.$executeRawUnsafe(`
        UPDATE comment_videos
        SET 
          total_comment_reply = 0
        WHERE 
          id NOT IN (SELECT DISTINCT parent_id FROM comment_videos WHERE parent_id IS NOT NULL);
      `);

      console.log('Cron job completed: total_comment_reply updated.');
    } catch (error) {
      console.error('Error updating total_comment_reply:', error);
    }
  }

  async create(createCommentDto: CreateCommentDto): Promise<comment_videos> {
    const foundVideo = await lastValueFrom<VideoDto>(
      this.shortVideoService
        .send('findOneVideo', createCommentDto.video_id)
        .pipe(handleRetryWithBackoff(3, 1000)),
    );
    if (!foundVideo || foundVideo.status === 0) {
      throw new RpcException({
        message: 'Not found video',
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }
    if (createCommentDto.parent_id) {
      const foundParentComment = await this.findOne(createCommentDto.parent_id);
      if (!foundParentComment) {
        throw new RpcException({
          message: 'Not found parent comment',
          statusCode: HttpStatus.BAD_REQUEST,
        });
      }
    }
    return this.prismaService.comment_videos.create({
      data: { ...createCommentDto, status: 1 },
    });
  }

  findAll({
    cursor,
    limit = 20,
    skip = 0,
    video_id,
  }: PagingDto & { video_id: number }): Promise<comment_videos[]> {
    const options: Prisma.comment_videosFindManyArgs = {
      take: limit,
      where: {
        video_id: video_id,
        status: 1,
      },
    };
    if (cursor) {
      options.cursor = {
        id: cursor,
      };
      skip = 1;
    }
    options.skip = skip;

    return this.prismaService.comment_videos.findMany(options);
  }

  findOne(id: number): Promise<comment_videos> {
    return this.prismaService.comment_videos.findFirst({
      where: {
        id,
      },
    });
  }

  async update({
    id,
    content,
    user_id,
  }: UpdateCommentDto): Promise<comment_videos> {
    const foundComment = await this.findOne(id);
    if (!foundComment || foundComment.status === 0) {
      throw new RpcException({
        message: 'Not found comment',
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }
    const user = foundComment.user as any;

    if (user.id !== user_id) {
      throw new RpcException({
        statusCode: HttpStatus.FORBIDDEN,
        message: 'forbidden user',
      });
    }
    return this.prismaService.comment_videos.update({
      where: {
        id: id,
      },
      data: {
        content,
      },
    });
  }

  async remove(id: number, user_id: number) {
    const foundComment = await this.findOne(id);
    if (!foundComment || foundComment.status === 0) {
      throw new RpcException({
        message: 'Not found comment',
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }
    const user = foundComment.user as any;

    if (user.id !== user_id) {
      throw new RpcException({
        statusCode: HttpStatus.FORBIDDEN,
        message: 'forbidden user',
      });
    }
    return this.prismaService.comment_videos.delete({
      where: {
        id,
      },
    });
  }
}
