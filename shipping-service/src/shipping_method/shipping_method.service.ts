import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateShippingMethodDto } from './dto/create-shipping_method.dto';
import { UpdateShippingMethodDto } from './dto/update-shipping_method.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class ShippingMethodService {
  constructor(private prismaService: PrismaService) {}
  create(payload: CreateShippingMethodDto) {
    // check name unique
    const foundShippingMethod = this.prismaService.shipping_method.findFirst({
      where: {
        name: payload.name,
      },
    });
    if (foundShippingMethod)
      throw new RpcException({
        message: 'Shipping method exists',
        statusCode: HttpStatus.BAD_REQUEST,
      });
    return this.prismaService.shipping_method.create({ data: payload });
  }

  findAll() {
    return this.prismaService.shipping_method.findMany();
  }

  findOne(id: number) {
    return this.prismaService.shipping_method.findFirst({ where: { id } });
  }

  async update({ id, ...payload }: UpdateShippingMethodDto) {
    const foundShippngMethod = await this.findOne(id);
    if (!foundShippngMethod) {
      throw new RpcException({
        message: 'Shipping method not exists',
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }
    return this.prismaService.shipping_method.update({
      where: {
        id,
      },
      data: payload,
    });
  }

  async remove(id: number) {
    const foundShippngMethod = await this.findOne(id);
    if (!foundShippngMethod) {
      throw new RpcException({
        message: 'Shipping method not exists',
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }
    return this.prismaService.shipping_method.update({
      where: { id },
      data: { status: 0 },
    });
  }
}
