import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateShippingDto } from './dto/create-shipping.dto';
import { UpdateShippingDto } from './dto/update-shipping.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ShippingStatus } from '@prisma/client';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class ShippingService {
  constructor(private prisma: PrismaService) {}
  create(payload: CreateShippingDto) {
    return this.prisma.shippings.create({
      data: {
        ...payload,
        status: ShippingStatus.Pending,
        address: payload.address as any,
      },
    });
  }

  findAll() {
    return `This action returns all shipping`;
  }

  async changeState(state: ShippingStatus, order_id: number) {
    //find order
    const foundShippingByOrder = await this.prisma.shippings.findFirst({
      where: {
        order_id: order_id,
      },
    });
    if (!foundShippingByOrder)
      throw new RpcException({
        message: 'Shipping by order not found',
        statusCode: HttpStatus.BAD_REQUEST,
      });
    return this.prisma.shippings.update({
      where: {
        id: foundShippingByOrder.id,
      },
      data: {
        status: state,
      },
    });
  }

  findOne(id: number) {
    return this.prisma.shippings.findFirst({
      where: {
        id,
      },
    });
  }

  update(id: number, updateShippingDto: UpdateShippingDto) {
    return `This action updates a #${id} shipping`;
  }

  remove(id: number) {
    return `This action removes a #${id} shipping`;
  }
}
