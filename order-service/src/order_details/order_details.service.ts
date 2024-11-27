import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class OrderDetailsService {
  constructor(private prisma: PrismaService) {}

  // Create a new order detail
  async create(data: Prisma.order_detailsCreateInput) {
    return this.prisma.order_details.create({ data });
  }

  // Find all order details for a specific order
  async findAllByOrderId(orderId: number) {
    return this.prisma.order_details.findMany({
      where: { order_id: orderId },
    });
  }

  // Find a single order detail by ID
  async findOne(id: number) {
    return this.prisma.order_details.findUnique({
      where: { id },
    });
  }

  // Update an order detail
  async update(id: number, data: Prisma.order_detailsUpdateInput) {
    return this.prisma.order_details.update({
      where: { id },
      data,
    });
  }

  // Delete an order detail by ID
  async remove(id: number) {
    return this.prisma.order_details.delete({
      where: { id },
    });
  }
}
