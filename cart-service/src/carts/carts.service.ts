import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class CartsService {
  constructor(private prisma: PrismaService) {}

  // Create a new cart for the authenticated user (using req.user.id for user_id)
  async create(userId: number) {
    const foundCart = await this.prisma.carts.findFirst({
      where: {
        id: userId,
      },
    });
    if (foundCart)
      throw new RpcException({
        message: 'Cart with user exists',
        statusCode: HttpStatus.BAD_REQUEST,
      });
    return this.prisma.carts.create({
      data: {
        user_id: userId,
        status: 1,
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.carts.findUnique({
      where: { id },
      include: { cart_items: true },
    });
  }
}
