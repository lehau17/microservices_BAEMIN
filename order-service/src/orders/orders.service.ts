import {
  Injectable,
  BadRequestException,
  Inject,
  HttpStatus,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { CreateOrderDto } from './dto/create-order.dto';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { CartDto } from './dto/cart.dto';

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    @Inject('USER_SERVICE') private userService: ClientProxy,
    @Inject('PRODUCT_SERVICE') private productService: ClientProxy,
  ) {}

  async create(data: CreateOrderDto, user_id: number) {
    const myCart = await lastValueFrom<CartDto[]>(
      this.userService.send('getCarts', user_id),
    );

    if (myCart.length == 0) {
      throw new RpcException({
        message: 'Giỏ hàng rỗng',
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }

    for (let i = 0; i < data.cart_items.length; i++) {
      const orderItem = data.cart_items[i];

      const cartItem = myCart.find(
        (cartItem) =>
          cartItem.food_id === orderItem.food_id &&
          cartItem.quantity === orderItem.quantity &&
          cartItem.price === orderItem.price,
      );

      if (!cartItem) {
        throw new RpcException({
          message: `Item with food_id ${orderItem.food_id} and quantity ${orderItem.quantity} does not match the items in the cart`,
          statusCode: HttpStatus.BAD_REQUEST,
        });
      }
    }
    let totalAmount = 0;
    let totalQuantity = 0;
    for (let i = 0; i < data.cart_items.length; i++) {
      const orderItem = data.cart_items[i];
      totalQuantity += orderItem.quantity;
      totalAmount += orderItem.price * orderItem.quantity;
    }

    const newOrder = await this.prisma.orders.create({
      data: {
        status: 1,
        total_amount: totalQuantity,
        address_shipping: data.address_shipping,
        user_id: user_id,
        total_price: totalAmount,
        voucher_used: data.voucher_used as unknown as Prisma.InputJsonValue,
      },
    });
    const payloadDesStock = data.cart_items.map((item) => {
      return {
        food_id: item.food_id,
        quantity: item.quantity,
      };
    });

    // sửa product service
    this.productService.emit('desStock', payloadDesStock),
      await Promise.all([
        await this.prisma.order_details.createMany({
          data: data.cart_items.map((item) => {
            return {
              order_id: newOrder.id,
              food_id: item.food_id,
              quantity: item.quantity,
              price: item.price,
              total_price: item.quantity * item.price,
              status: 1,
            };
          }),
        }),
        //   await this.prisma.cart_items.deleteMany({
        //     where: {
        //       cart_id: myCart.id,
        //       food_id: { in: data.cart_items.map((item) => item.food_id) },
        //     },
        //   }),
        //   ...promiseArrayUpdateStock,
      ]);

    return newOrder;
  }
  // Find all orders for a user
  async findAllByUserId(userId: number) {
    return this.prisma.orders.findMany({
      where: { user_id: userId },
      include: { order_details: true }, // Including the related order details
    });
  }

  // Find a single order by ID
  async findOne(id: number) {
    return this.prisma.orders.findUnique({
      where: { id },
      include: { order_details: true },
    });
  }

  // Update an order
  async update(id: number, data: Prisma.ordersUpdateInput) {
    return this.prisma.orders.update({
      where: { id },
      data,
    });
  }

  // Delete an order by ID
  async remove(id: number) {
    return this.prisma.orders.delete({
      where: { id },
    });
  }
}
