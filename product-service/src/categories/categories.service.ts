import {
  HttpStatus,
  Injectable,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { categories, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { RpcException } from '@nestjs/microservices';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
@Injectable()
export class CategoriesService {
  constructor(
    private prisma: PrismaService,

    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async create(data: Prisma.categoriesCreateInput) {
    return this.prisma.categories.create({ data });
  }

  async findAll({
    limit = 20,
    skip = 0,
    cursor,
  }: {
    limit?: number;
    skip?: number;
    cursor?: number;
  }) {
    const result: categories[] = await this.cacheManager.get(
      `cates:cursor:${cursor ? cursor : 0}:page:${cursor ? 0 : skip / limit + 1}`,
    );
    if (result) {
      return {
        data: result,
        filter: {
          limit,
          skip,
        },
        cursor: {
          prevCursor: cursor,
          nextCursor: result.length > limit ? result[length - 1].id : null,
        },
      };
    }
    const options: Prisma.categoriesFindManyArgs = {
      take: limit,
      include: {
        foods: {
          take: 10,
        },
      },
    };

    if (cursor) {
      options.skip = 1;
      options.cursor = { id: cursor };
    } else if (skip) {
      options.skip = skip;
    }

    const data = await this.prisma.categories.findMany(options);
    if (data && data.length > 0) {
      await this.cacheManager.set(
        `cates:cursor:${cursor ? cursor : 0}:page:${cursor ? 0 : skip / limit + 1}`,
        data,
      );
    }
    return {
      data: data,
      filter: {
        limit,
        skip,
      },
      cursor: {
        prevCursor: cursor,
        nextCursor: data.length > limit ? data[length - 1].id : null,
      },
    };
  }

  async findOne(id: number) {
    return this.prisma.categories.findUnique({
      where: { id },
    });
  }

  async update(data: UpdateCategoryDto) {
    const foundCate = await this.prisma.categories.findFirst({
      where: {
        id: data.id,
      },
    });
    if (!foundCate || foundCate.status === 0) {
      throw new RpcException({
        message: 'not found category',
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }
    await this.cacheManager.reset();

    return this.prisma.categories.update({
      where: { id: data.id },
      data,
    });
  }

  async remove(id: number) {
    const foundCate = await this.prisma.categories.findFirst({
      where: {
        id: id,
      },
    });
    if (!foundCate || foundCate.status === 0) {
      throw new RpcException({
        message: 'not found category',
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }
    await this.cacheManager.reset();
    return this.prisma.categories.update({
      where: { id },
      data: {
        status: 0,
      },
    });
  }
}
