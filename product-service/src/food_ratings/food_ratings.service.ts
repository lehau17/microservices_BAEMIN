import { FoodService } from './../food/food.service';
import {
  BadRequestException,
  ForbiddenException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateFoodRatingDto } from './dto/create-food_rating.dto';
import { UpdateFoodRatingDto } from './dto/update-food_rating.dto';
import { PagingDto } from 'src/common/dto/paging.dto';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class FoodRatingsService {
  constructor(
    private prisma: PrismaService,
    private foodService: FoodService,
  ) {}

  async create({
    food_id,
    food_rate_point,
    food_rate_comment,
    user_id,
  }: CreateFoodRatingDto) {
    //check food
    const foundFood = await this.foodService.findOne(food_id);
    if (!foundFood || foundFood.status != 1)
      throw new RpcException({
        message: `Food not found`,
        statusCode: HttpStatus.BAD_REQUEST,
      });
    const [data, _] = await Promise.all([
      this.prisma.food_ratings.create({
        data: {
          foods: { connect: { id: food_id } },
          food_rate_point,
          food_rate_comment,
          status: 1,
          user_id: user_id,
        },
      }),
      await this.foodService.incTotalRating(food_id),
    ]);
    return data;
  }

  async findAll(limit = 20, skip?: number, cursor?: number) {
    const options: Prisma.food_ratingsFindManyArgs = {
      take: limit,
    };

    if (cursor) {
      options.skip = 1;
      options.cursor = { id: cursor };
    } else if (skip) {
      options.skip = skip;
    }

    return this.prisma.food_ratings.findMany(options);
  }

  async findOne(id: number) {
    return this.prisma.food_ratings.findUnique({
      where: { id },
    });
  }

  async update({ food_id, id, user_id, ...dataUpdate }: UpdateFoodRatingDto) {
    const foundRating = await this.findOne(id);
    if (!foundRating || foundRating.status != 1) {
      throw new RpcException({
        message: `cannot update`,
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }
    if (foundRating.user_id !== user_id) {
      throw new RpcException({
        message: `not role`,
        statusCode: HttpStatus.FORBIDDEN,
      });
    }
    return this.prisma.food_ratings.update({
      where: { id },
      data: {
        updated_at: new Date(),
        ...dataUpdate,
      },
    });
  }

  async remove(id: number, user_id: number) {
    const foundRating = await this.prisma.food_ratings.findFirst({
      where: { id },
    });
    if (!foundRating) {
      throw new RpcException({
        message: `not found`,
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }
    if (foundRating.user_id !== user_id)
      throw new RpcException({
        message: `not role`,
        statusCode: HttpStatus.FORBIDDEN,
      });

    const [data, _] = await Promise.all([
      await this.prisma.food_ratings.delete({
        where: { id: foundRating.id },
      }),
      await this.foodService.desTotalRating(foundRating.food_id),
    ]);
    return data;
  }

  // Additional functionalities

  async rateFood(
    user_id: number,
    food_id: number,
    food_rate_point: number,
    food_rate_comment: string,
  ) {
    const existingRating = await this.prisma.food_ratings.findFirst({
      where: { user_id, food_id },
    });

    if (existingRating) {
      return this.prisma.food_ratings.update({
        where: { id: existingRating.id },
        data: { food_rate_point, food_rate_comment, updated_at: new Date() },
      });
    } else {
      return this.prisma.food_ratings.create({
        data: {
          user_id,
          food_id,
          food_rate_point,
          food_rate_comment,
          status: 1,
        },
      });
    }
  }

  async getAverageRating(food_id: number) {
    const ratings = await this.prisma.food_ratings.findMany({
      where: { food_id, status: 1 },
      select: { food_rate_point: true },
    });

    const totalRatings = ratings.length;
    const averageRating = totalRatings
      ? ratings.reduce((sum, rating) => sum + rating.food_rate_point, 0) /
        totalRatings
      : 0;

    return { food_id, totalRatings, averageRating };
  }

  async getUserRatings(user_id: number, { cursor, limit, skip }: PagingDto) {
    const options: Prisma.food_ratingsFindManyArgs = {
      where: { user_id, status: 1 },
      take: limit,
      skip: cursor ? 1 : skip,
      include: { foods: true },
      cursor: cursor ? { id: cursor } : undefined,
    };

    const data = await this.prisma.food_ratings.findMany(options);
    return {
      data,
      filter: {
        cursor,
        limit,
        skip,
      },
      cursor: {
        prevCursor: cursor,
        nextCursor: data.length > limit ? data[length - 1].id : undefined,
      },
    };
  }

  async getFoodRatings(food_id: number) {
    return this.prisma.food_ratings.findMany({
      where: { food_id, status: 1 },
    });
  }
}
