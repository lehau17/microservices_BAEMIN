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

@Injectable()
export class CommentService {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject('SHORT_VIDEO_SERVICE')
    private readonly shortVideoService: ClientProxy,
  ) {}
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
    return foundComment;
  }

  remove(id: number) {
    return `This action removes a #${id} comment`;
  }
}
