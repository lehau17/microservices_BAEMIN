import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { foods, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateFoodDto } from './dto/create-food.dto';
import DataResponse from './dto/find_food.dto';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { UpdateFoodDto } from './dto/update-food.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class FoodService {
  constructor(
    private prisma: PrismaService,
    @Inject('RESTAURANT_SERVICE') private restaurantService: ClientProxy,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async create(data: CreateFoodDto) {
    const foundRestaurant: any = await lastValueFrom(
      this.restaurantService.send('findOneRestaurant', data.user_id),
    );
    if (!foundRestaurant || foundRestaurant.status == 0) {
      throw new RpcException({
        statusCode: 400,
        message: 'Restaurant not found',
      });
    }
    const foundCate = await this.prisma.categories.findFirst({
      where: {
        id: data.cate_id,
      },
    });
    if (!foundCate) {
      throw new RpcException({
        message: 'cate not found',
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }
    const newFood = await this.prisma.foods.create({
      data: {
        food_images: data.food_images,
        food_name: data.food_name,
        categories: {
          connect: { id: foundCate.id },
        },
        res_id: data.user_id,
      },
    });
    if (!newFood)
      throw new RpcException({
        message: 'error occurred creating',
        statusCode: HttpStatus.BAD_REQUEST,
      });
    await Promise.all([
      await this.prisma.foods_details.create({
        data: {
          id: newFood.id,
          food_price: data.food_price,
          food_stock: data.food_stock || 0,
        },
      }),
      await this.cacheManager.reset(),
    ]);
    return newFood;
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
    const result: foods[] = await this.cacheManager.get(
      `foods:cursor:${cursor ? cursor : 0}:page:${cursor ? 0 : skip / limit + 1}`,
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
    const options: Prisma.foodsFindManyArgs = {
      take: limit,
      where: {
        status: 1,
      },
    };

    if (cursor) {
      options.cursor = { id: cursor };
      options.skip = 1;
    } else {
      options.skip = skip;
    }
    const data = await this.prisma.foods.findMany(options);
    this.cacheManager.set(
      `foods:cursor:${cursor ? cursor : 0}:page:${cursor ? 0 : skip / limit + 1}`,
      data,
    );
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
    const foundFood = await this.prisma.foods.findFirst({
      where: { id },
      include: { foods_details: true },
    });
    return foundFood;
  }

  async findFood({
    limit = 20,
    skip = 0,
    cursor,
    name,
    cate,
    c_time = 1,
    from_price = 0,
    to_price,
  }: {
    limit?: number;
    skip?: number;
    cursor?: number;
    name?: string;
    cate?: number;
    c_time?: number;
    from_price?: number;
    to_price?: number;
  }) {
    const data = await this.prisma.$queryRaw<DataResponse[]>`
        SELECT 
            f.id AS id,
            f.food_name,
            f.cate_id,
            f.food_description,
            f.food_total_like,
            f.food_total_rating,
            f.food_avg_rating,
            fd.food_price,
            fd.food_stock,
            f.created_at,
            f.updated_at
          FROM foods f
          INNER JOIN foods_details fd ON f.id = fd.id
          WHERE f.id > ${cursor ? cursor : 0} AND f.status = 1
          ${name ? Prisma.sql`AND f.food_name ILIKE ${'%' + name + '%'}` : Prisma.empty}
          ${cate ? Prisma.sql`AND f.cate_id = ${cate}` : Prisma.empty}
          ${from_price ? Prisma.sql`AND fd.food_price >= ${from_price}` : Prisma.empty}
          ${to_price ? Prisma.sql`AND fd.food_price <= ${to_price}` : Prisma.empty}
          ORDER BY ${c_time == 1 ? Prisma.sql`created_at desc` : `created_at asc`}
          LIMIT ${limit} OFFSET ${skip};
        `;

    const nextCursor = data.length > limit ? data[data.length - 1].id : null;

    return {
      data: data,
      filter: {
        limit,
        skip,
        name,
        cate,
        c_time,
        from_price,
        to_price,
      },
      cursor: {
        prevCursor: cursor || null,
        nextCursor,
      },
    };
  }

  async update(id: number, data: UpdateFoodDto) {
    const foundFood = await this.prisma.foods.findFirst({ where: { id } });
    if (!foundFood || foundFood.status === 0) {
      throw new RpcException({
        message: 'not found food',
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }
    await this.cacheManager.reset();
    return this.prisma.foods.update({
      where: { id },
      data,
    });
  }

  async incLike(id: number) {
    this.prisma.$executeRaw`UPDATE foods
      SET food_total_like = food_total_like + 1
      WHERE id = ${id}; `;
  }

  async desLike(id: number) {
    this.prisma.$executeRaw`UPDATE foods
      SET food_total_like = food_total_like -1
      WHERE id = ${id} and food_total_like > 0`;
  }

  async incTotalRating(id: number) {
    const data = await this.prisma.$executeRaw`UPDATE foods
      SET food_total_rating = food_total_rating + 1
      WHERE id = ${id}; `;
    return data;
  }

  async desTotalRating(id: number) {
    await this.prisma.$executeRaw`UPDATE foods
      SET food_total_rating = food_total_rating -1
      WHERE id = ${id} and food_total_rating > 0`;
  }

  async remove(id: number) {
    const foundFood = await this.findOne(id);
    if (!foundFood || foundFood.status === 0) {
      throw new RpcException({
        message: 'food not found',
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }
    return this.prisma.foods.update({
      where: {
        id: id,
      },
      data: {
        status: 0,
      },
    });
  }

  async desStock({ food_id, quantity }: { food_id: number; quantity: number }) {
    const foundFood = await this.findOne(food_id);
    if (!foundFood || foundFood.status === 0) {
      throw new RpcException({
        message: 'food not found',
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }
    return this.prisma.foods_details.update({
      where: { id: food_id },
      data: {
        food_stock: {
          decrement: quantity,
        },
      },
    });
  }

  async checkStock(food_id: number, quantity: number) {
    const foundFood = await this.findOne(food_id);
    if (!foundFood || foundFood.status === 0) {
      throw new RpcException({
        message: 'food not found',
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }
    if (foundFood.foods_details.food_stock < quantity) {
      throw new RpcException({
        message: 'out of stock',
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }
    return true;
  }

  async checkAllStock(payload: { food_id: number; quantity: number }[]) {
    const promiseCheckStock = payload.map((item) => {
      return this.checkStock(item.food_id, item.quantity);
    });
    await Promise.all(promiseCheckStock);
    return true;
  }

  async desManyStock(payload: { food_id: number; quantity: number }[]) {
    const promiseHandler = payload.map((item) => {
      return this.desStock(item);
    });
    const result = await Promise.all(promiseHandler);
    return result.length > 0;
  }

  async findFoodsByIds(foodsIds: number[]) {
    const foundFoods = await this.prisma.foods.findMany({
      where: {
        id: {
          in: foodsIds,
        },
      },
      include: {
        foods_details: true,
      },
    });

    const foodMap = {};
    foundFoods.forEach((food) => {
      foodMap[food.id] = food;
    });
    return foodMap;
  }
}
