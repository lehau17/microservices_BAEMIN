import { HttpStatus, Injectable, BadRequestException } from '@nestjs/common';
import { CreateRestaurantRatingDto } from './dto/create-restaurant_rating.dto';
import { UpdateRestaurantRatingDto } from './dto/update-restaurant_rating.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class RestaurantRatingService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateRestaurantRatingDto) {
    // check res
    const { res_id, res_rate_comment, res_rate_point } = data;
    const foundRes = await this.prisma.restaurants.findFirst({
      where: { id: res_id },
    });
    if (!foundRes || foundRes.status === 0) {
      throw new RpcException({
        message: 'Notfound restaurant',
        statusCode: 400,
      });
    }
    return this.prisma.restaurant_ratings.create({
      data: {
        res_rate_comment,
        res_rate_point,
        status: 1,
        res_id: foundRes.id,
        user_id: data.user_id,
      },
    });
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
    const options: Prisma.restaurant_ratingsFindManyArgs = {
      take: limit,
    };

    if (cursor) {
      options.skip = 1;
      options.cursor = { id: cursor };
    } else if (skip) {
      options.skip = skip;
    }

    return this.prisma.restaurant_ratings.findMany(options);
  }

  async findAllByRes({
    limit = 20,
    skip = 0,
    cursor,
    id,
  }: {
    limit?: number;
    skip?: number;
    cursor?: number;
    id: number;
  }) {
    const options: Prisma.restaurant_ratingsFindManyArgs = {
      take: limit,
      where: {
        res_id: id,
      },
    };

    if (cursor) {
      options.skip = 1;
      options.cursor = { id: cursor };
    } else if (skip) {
      options.skip = skip;
    }

    const data = await this.prisma.restaurant_ratings.findMany(options);
    const nextCursor = data.length > limit ? data[data.length - 1].id : null; // Xác định con trỏ tiếp theo

    return {
      data,
      filter: {
        limit,
        skip,
      },
      cursor: {
        prevCursor: cursor || null,
        nextCursor,
      },
    };
  }

  async findOne(id: number) {
    return this.prisma.restaurant_ratings.findUnique({
      where: { id },
    });
  }

  async update(id: number, data: Prisma.restaurant_ratingsUpdateInput) {
    const foundRating = await this.findOne(id);
    if (!foundRating || foundRating.status == 0)
      throw new RpcException({
        message: 'Not found rating',
        statusCode: HttpStatus.BAD_REQUEST,
      });
    if (foundRating.user_id !== data.user_id)
      throw new RpcException({
        message: 'no permission to update this rating',
        statusCode: HttpStatus.FORBIDDEN,
      });
    return this.prisma.restaurant_ratings.update({
      where: { id },
      data,
    });
  }

  async remove(id: number, userId: number) {
    const foundRating = await this.findOne(id);
    if (!foundRating || foundRating.status == 0)
      throw new RpcException({
        message: 'Not found rating',
        statusCode: HttpStatus.BAD_REQUEST,
      });
    if (foundRating.user_id !== userId)
      throw new RpcException({
        message: 'no permission to delete this rating',
        statusCode: HttpStatus.FORBIDDEN,
      });
    return this.prisma.restaurant_ratings.update({
      where: { id, user_id: userId, status: 1 },
      data: {
        status: 0,
      },
    });
  }
  async getUserRatings(user_id: number) {
    return this.prisma.restaurant_ratings.findMany({
      where: { user_id },
    });
  }
}
