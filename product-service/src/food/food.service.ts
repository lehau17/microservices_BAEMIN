import {
  BadRequestException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateFoodDto } from './dto/create-food.dto';
import DataResponse from './dto/find_food.dto';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { UpdateFoodDto } from './dto/update-food.dto';

@Injectable()
export class FoodService {
  constructor(
    private prisma: PrismaService,
    @Inject('RESTAURANT_SERVICE') private restaurantService: ClientProxy,
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
          connect: { id: foundCate.id }, // Kết nối với danh mục có id = 1 trong bảng categories
        },
        res_id: data.user_id,
      },
    });
    if (!newFood)
      throw new RpcException({
        message: 'error occurred creating',
        statusCode: HttpStatus.BAD_REQUEST,
      });
    await this.prisma.foods_details.create({
      data: {
        id: newFood.id,
        food_price: data.food_price,
        food_stock: data.food_stock || 0,
      },
    });
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
    console.log('dô đây', id);
    const foundFood = await this.prisma.foods.findFirst({
      where: { id },
      include: { foods_details: true },
    });
    console.log('check food found', foundFood);
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
    // const options: Prisma.foodsFindManyArgs = {
    //   take: limit,
    //   include: {
    //     foods_details: {
    //       where: {
    //         food_price: {
    //           gt: from_price,
    //         },
    //       },
    //     },
    //   },
    //   orderBy: c_time
    //     ? {
    //       created_at: c_time == 1 ? 'desc' : 'asc',
    //     }
    //     : undefined,
    //   where: {
    //     status: 1,
    //     ...(cate && {
    //       cate_id: cate,
    //     }),
    //     ...(name && {
    //       food_name: {
    //         contains: name,
    //         mode: 'insensitive',
    //       },
    //     }),
    //   },
    // };

    // if (cursor) {
    //   options.cursor = { id: cursor };
    //   options.skip = 1;
    // } else {
    //   options.skip = skip;
    // }

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
    return this.prisma.foods.update({
      where: { id },
      data: {
        status: 0,
      },
    });
  }
}
