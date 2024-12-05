import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class OrderDetailsService {
  constructor(private prisma: PrismaService) {}
  async create(data: Prisma.order_detailsCreateInput) {
    return this.prisma.order_details.create({ data });
  }
  async findAllByOrderId(orderId: number) {
    return this.prisma.order_details.findMany({
      where: { order_id: orderId },
    });
  }
  async findOne(id: number) {
    return this.prisma.order_details.findUnique({
      where: { id },
    });
  }
  async update(id: number, data: Prisma.order_detailsUpdateInput) {
    return this.prisma.order_details.update({
      where: { id },
      data,
    });
  }
  async remove(id: number) {
    return this.prisma.order_details.delete({
      where: { id },
    });
  }
}
