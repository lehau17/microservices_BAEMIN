import { handleRetryWithBackoff } from 'src/common/utils/handlerTimeoutWithBackoff';
import { PrismaService } from 'src/prisma/prisma.service';
import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { PagingDto } from 'src/common/paging/paging';
import { Prisma, StateVideo, videos } from '@prisma/client';

@Injectable()
export class VideoService {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject('RESTAURANT_SERVICE')
    private readonly restaurantService: ClientProxy,
  ) {}
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
    return this.prismaService.videos.create({ data: createVideoDto });
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
