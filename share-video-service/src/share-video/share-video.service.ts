import { Inject, Injectable } from '@nestjs/common';
import { CreateShareVideoDto } from './dto/create-share-video.dto';
import { UpdateShareVideoDto } from './dto/update-share-video.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PagingDto } from 'src/common/dto/paging.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ShareVideoService {
  constructor(private prismaService: PrismaService) {}
  create(createShareVideoDto: CreateShareVideoDto) {
    return this.prismaService.share_videos.create({
      data: createShareVideoDto,
    });
  }

  findAll() {
    return `This action returns all shareVideo`;
  }

  findAllByVideo({
    video_id,
    limit,
    skip = 1,
    cursor,
  }: PagingDto & { video_id: number }) {
    const options: Prisma.share_videosFindManyArgs = {
      take: limit,
      where: {
        video_id: video_id,
      },
    };
    if (cursor) {
      options.cursor = {
        id: cursor,
      };
    }
    options.skip = skip;
    return this.prismaService.share_videos.findMany(options);
  }

  findOne(id: number) {
    return this.prismaService.share_videos.findFirst({
      where: {
        id,
      },
    });
  }

  update(id: number, updateShareVideoDto: UpdateShareVideoDto) {
    return `This action updates a #${id} shareVideo`;
  }

  remove(id: number) {
    return this.prismaService.share_videos.delete({
      where: { id },
    });
  }
}
