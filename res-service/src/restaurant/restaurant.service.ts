import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { Prisma } from '@prisma/client';
import { UpdateAddressDto } from './dto/update-address.dto';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class RestaurantService {
  constructor(private prismaService: PrismaService) {}
  async create(createRestaurantDto: CreateRestaurantDto) {
    const foundRes = await this.prismaService.restaurants.findFirst({
      where: {
        id: createRestaurantDto.id,
      },
    });
    if (foundRes) {
      throw new RpcException({
        statusCode: 400,
        message: 'Mỗi user chỉ có 1 nhà hàng thoi',
      });
    }
    return this.prismaService.restaurants.create({
      data: { ...createRestaurantDto },
    });
  }

  async findAll(limit = 20, skip?: number, cursor?: number) {
    const options: Prisma.restaurantsFindManyArgs = {
      take: limit,
    };

    if (cursor) {
      options.skip = 1;
      options.cursor = { id: cursor };
    } else if (skip) {
      options.skip = skip;
    }

    return this.prismaService.restaurants.findMany(options);
  }
  async findOne(id: number) {
    const foundRestaurant = await this.prismaService.restaurants.findFirst({
      where: { id },
    });

    return foundRestaurant;
  }

  async update(id: number, data: Prisma.restaurantsUpdateInput) {
    const foundRes = await this.findOne(id);
    if (!foundRes || foundRes.status == 0) {
      throw new RpcException({
        statusCode: 400,
        message: 'Restaurant not found',
      });
    }
    return this.prismaService.restaurants.update({
      where: { id },
      data: {
        ...data,
        updated_at: new Date(),
      },
    });
  }

  async updateAddress({ id, latitude, longitude }: UpdateAddressDto) {
    const foundRes = await this.findOne(id);
    if (!foundRes || foundRes.status == 0) {
      throw new RpcException({
        statusCode: 400,
        message: 'Restaurant not found',
      });
    }
    return this.prismaService.restaurants.update({
      where: {
        id,
      },
      data: {
        latitude: new Decimal(latitude),
        longitude: new Decimal(longitude),
      },
    });
  }

  async remove(id: number) {
    const foundRes = await this.findOne(id);
    if (!foundRes || foundRes.status === 0) {
      throw new RpcException({
        statusCode: 400,
        message: 'restaurant không tồn tại',
      });
    }
    return this.prismaService.restaurants.update({
      where: {
        id: id,
      },
      data: {
        status: 0,
        updated_at: new Date(),
      },
    });
  }
}
