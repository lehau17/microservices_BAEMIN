import { handleRetryWithBackoff } from 'src/common/utils/handlerTimeoutWithBackoff';
import { PrismaService } from 'src/prisma/prisma.service';
import { HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { PagingDto } from 'src/common/utils/paging/paging';
import { Prisma, StateVideo, videos } from '@prisma/client';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as async from 'async';
import { RedisService } from 'src/redis/redis.service';
@Injectable()
export class VideoService {
  private readonly logger = new Logger(VideoService.name);
  constructor(
    private readonly prismaService: PrismaService,
    @Inject('RESTAURANT_SERVICE')
    private readonly restaurantService: ClientProxy,
    private readonly redisService: RedisService,
  ) {}

  @Cron(CronExpression.EVERY_30_SECONDS)
  async updateView() {
    // this.logger.debug('vào cron');
    const client = this.redisService.getClient();
    const pattern = 'video:*'; // Each video has a key like ' video:{id}'
    let cursor = 0;
    const batchSize = 1000;

    const limit = async.queue(async (task: any, done) => {
      const viewCount = await client.get(task.key);
      const videoId = task.key.split(':')[1];
      if (videoId && viewCount) {
        try {
          await this.updateViewInDatabase(+videoId, +viewCount);
        } catch (error) {
          this.logger.debug('Lỗi update view');
        }
      }
      await client.del(task.key);
      done();
    }, 10); // Limit to 10 concurrent tasks

    do {
      const [newCursor, keys] = await client.scan(
        cursor,
        'MATCH',
        pattern,
        'COUNT',
        batchSize,
      );
      if (keys.length <= 0) {
        this.logger.debug('Không có view để update');
        return;
      }
      cursor = parseInt(newCursor, 10);

      keys.forEach((key) => {
        limit.push({ key });
      });
    } while (cursor !== 0);

    // Wait for all tasks to complete
    await limit.drain();

    this.logger.debug('Completed updating views');
  }

  @Cron(CronExpression.EVERY_30_SECONDS)
  async updateLike() {
    // this.logger.debug('vào cron');
    const client = this.redisService.getClient();
    const pattern = 'video_like:*'; // Each video has a key like ' video:{id}'
    let cursor = 0;
    const batchSize = 1000;

    const limit = async.queue(async (task: any, done) => {
      const likeCount = await client.get(task.key);
      const videoId = task.key.split(':')[1];
      if (videoId && likeCount) {
        try {
          await this.updateLikeInDatabase(+videoId, +likeCount);
        } catch (error) {
          this.logger.debug('Lỗi update like');
        }
      }
      await client.del(task.key);
      done();
    }, 10); // Limit to 10 concurrent tasks

    do {
      const [newCursor, keys] = await client.scan(
        cursor,
        'MATCH',
        pattern,
        'COUNT',
        batchSize,
      );
      if (keys.length <= 0) {
        this.logger.debug('Không có like để update');
        return;
      }
      cursor = parseInt(newCursor, 10);

      keys.forEach((key) => {
        limit.push({ key });
      });
    } while (cursor !== 0);

    // Wait for all tasks to complete
    await limit.drain();

    this.logger.debug('Completed updating like');
  }

  private async updateViewInDatabase(video_id: number, view: number) {
    await this.prismaService.videos.update({
      where: {
        id: video_id,
      },
      data: {
        total_view: {
          increment: view,
        },
      },
    });
  }

  private async updateLikeInDatabase(video_id: number, like: number) {
    await this.prismaService.videos.update({
      where: {
        id: video_id,
      },
      data: {
        total_like: {
          increment: like,
        },
      },
    });
  }

  async increateViewRedis(id: number) {
    const client = this.redisService.getClient();
    const key = `video:${id}`;
    const viewCount = await client.get(key);
    let result: any;
    if (viewCount && viewCount !== '') {
      result = await client.set(key, +viewCount + 1);
    } else {
      result = await client.set(key, 1);
    }
    return result;
  }

  async increateLikeRedis(id: number) {
    const client = this.redisService.getClient();
    const key = `video_like:${id}`;
    const viewCount = await client.get(key);
    let result: any;
    if (viewCount && viewCount !== '') {
      result = await client.set(key, +viewCount + 1);
    } else {
      result = await client.set(key, 1);
    }
    return result;
  }

  async create(createVideoDto: CreateVideoDto): Promise<videos> {
    const foundShop = await lastValueFrom(
      this.restaurantService
        .send('findOneRestaurant', createVideoDto.shop_id)
        .pipe(handleRetryWithBackoff(3, 1000)),
    );
    if (!foundShop) {
      throw new RpcException({
        message: 'Not found shop',
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }
    return this.prismaService.videos.create({
      data: { ...createVideoDto, status: 1 },
    });
  }

  findAll({ cursor, limit = 20, skip = 0 }: PagingDto): Promise<videos[]> {
    const options: Prisma.videosFindManyArgs = {
      take: limit,
      orderBy: {
        id: 'desc',
      },
    };
    const where: Prisma.videosWhereInput = {
      status: 1,
      state_video: StateVideo.Publish,
    };

    if (cursor) {
      where.id = {
        gt: cursor,
      };
    } else {
      options.skip = skip;
    }
    options.where = where;
    return this.prismaService.videos.findMany(options);
  }

  findOne(id: number) {
    return this.prismaService.videos.findFirst({ where: { id, status: 1 } });
  }

  async update({ id, shop_id, ...payload }: UpdateVideoDto): Promise<videos> {
    const foundVideo = await this.findOne(id);
    if (!foundVideo || foundVideo.status === 0) {
      throw new RpcException({
        message: 'Not found video',
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }
    if (foundVideo.shop_id !== shop_id) {
      throw new RpcException({
        message: 'Forbidden',
        statusCode: HttpStatus.FORBIDDEN,
      });
    }
    return this.prismaService.videos.update({
      where: {
        id,
      },
      data: payload,
    });
  }

  async remove(id: number, shop_id: number): Promise<videos> {
    const foundVideo = await this.findOne(id);
    if (!foundVideo || foundVideo.status === 0) {
      throw new RpcException({
        message: 'Not found video',
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }
    if (foundVideo.shop_id !== shop_id) {
      throw new RpcException({
        message: 'Forbidden',
        statusCode: HttpStatus.FORBIDDEN,
      });
    }
    return this.prismaService.videos.update({
      where: { id },
      data: {
        status: 0,
      },
    });
  }
}
