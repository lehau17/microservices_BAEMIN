import { Injectable, Inject, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { CreateOrderDto } from './dto/create-order.dto';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, lastValueFrom, throwError } from 'rxjs';
import { CartDto } from './dto/cart.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { FindOrderByRestaurantDto } from './dto/find-order-by-restaurant.dto';

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    @Inject('USER_SERVICE') private userService: ClientProxy,
    @Inject('PRODUCT_SERVICE') private productService: ClientProxy,
    @Inject('MAIL_SERVICE') private mailService: ClientProxy,
    @Inject('RESTAURANT_SERVICE') private resService: ClientProxy,
    @Inject('VOUCHER_SERVICE') private voucherService: ClientProxy,
  ) {}

  async findOrderByRes({
    ownerId,
    cursor,
    limit = 20,
    skip,
  }: FindOrderByRestaurantDto) {
    // check res
    const foundRes = await lastValueFrom(
      this.resService.send('findOneRestaurant', ownerId).pipe(
        catchError((err) => {
          console.log(err);
          if (err instanceof RpcException) {
            throw err;
          } else {
            throw new RpcException({
              message: 'Error in res-service : findOneRestaurant',
              statusCode: HttpStatus.BAD_REQUEST,
            });
          }
        }),
      ),
    );

    if (!foundRes || foundRes.status === 0) {
      throw new RpcException({ message: 'Res not found', statusCode: 400 });
    }
    const options: Prisma.ordersFindManyArgs = {
      take: limit,
      cursor: cursor ? { id: cursor } : undefined,
      skip: cursor ? skip : 0,
      where: {
        status: 1,
        res_id: ownerId,
      },
      include: {
        order_details: true,
      },
    };
    const data = await this.prisma.orders.findMany(options);

    return {
      data,
      filter: {
        limit,
        skip,
      },
      cursor: {
        prevCursor: cursor,
        nextCursor: data.length >= limit ? data[length - 1].id : null,
      },
    };
  }

  async create(data: CreateOrderDto) {
    // Fetch cart items from user service
    const myCart = await lastValueFrom<CartDto[]>(
      this.userService.send('getCarts', data.user_id).pipe(
        catchError((error) => {
          console.error('Error fetching carts:', error);
          return throwError(() => new RpcException(error.getError()));
        }),
      ),
    );

    if (myCart.length === 0) {
      throw new RpcException({
        message: 'Giỏ hàng rỗng',
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }

    // Group cart items by res_id
    const groupedItems = data.cart_items.reduce(
      (group, item) => {
        const food = myCart.find(
          (cartItem) => cartItem.food_id === item.food_id,
        );
        if (!food) {
          throw new RpcException({
            message: `Item with food_id ${item.food_id} does not exist in the cart`,
            statusCode: HttpStatus.BAD_REQUEST,
          });
        }

        const resId = food.food.res_id;
        if (!group[resId]) {
          group[resId] = [];
        }
        group[resId].push(item);
        return group;
      },
      {} as Record<number, CreateOrderDto['cart_items']>,
    );

    // Create orders for each res_id
    const createdOrders = [];
    for (const [resId, cartItems] of Object.entries(groupedItems)) {
      let totalAmount = 0;
      let totalQuantity = 0;

      // Calculate total amount and quantity for this order
      cartItems.forEach((item) => {
        const cartItem = myCart.find((cart) => cart.food_id === item.food_id);
        if (
          !cartItem ||
          cartItem.food.foods_details.food_price !== item.price ||
          cartItem.quantity !== item.quantity ||
          cartItem.quantity > cartItem.food.foods_details.food_stock
        ) {
          throw new RpcException({
            message: `Có lỗi xảy ra khi tạo đơn hàng, vui lòng thử lại`,
            statusCode: HttpStatus.BAD_REQUEST,
          });
        }
        totalQuantity += item.quantity;
        totalAmount += item.price * item.quantity;
      });

      // Create the order
      const newOrder = await this.prisma.orders.create({
        data: {
          status: 1,
          total_amount: totalQuantity,
          address_shipping: data.address_shipping,
          user_id: data.user_id,
          total_price: totalAmount,
          voucher_used: data.voucher_used as unknown as Prisma.InputJsonValue,
          res_id: parseInt(resId),
        },
      });

      // Create order details
      await this.prisma.order_details.createMany({
        data: cartItems.map((item) => ({
          order_id: newOrder.id,
          food_id: item.food_id,
          quantity: item.quantity,
          price: item.price,
          total_price: item.quantity * item.price,
          status: 1,
        })),
      });

      // Emit desStock event for stock reduction
      const payloadDesStock = cartItems.map((item) => ({
        food_id: item.food_id,
        quantity: item.quantity,
      }));
      this.productService.emit('desStock', payloadDesStock);

      // Add to created orders list
      createdOrders.push(newOrder);
    }

    // Remove items from cart after all orders are created
    await lastValueFrom(
      this.userService.send('removeItemsWhenOrderSuccess', {
        user_id: data.user_id,
        food_ids: data.cart_items.map((item) => item.food_id),
      }),
    );

    this.mailService.emit('sendMail', {
      to: data.email,
      subject: 'Order Confirmation - Your E-Commerce Store',
      template: './order-confirmation', // Đường dẫn tới file template
      context: {
        customerName: data.email,
        orderId: '123456',
        orderDate: new Date().toUTCString(),
        orderTotal: 150.5,
        orderItems: [
          { name: 'Product A', quantity: 2, price: 50 },
          { name: 'Product B', quantity: 1, price: 50.5 },
        ],
        supportUrl: 'https://example.com/support',
        orderDetailsUrl: 'https://example.com/orders/123456',
        year: new Date().getFullYear(),
      },
    });

    return createdOrders; // Return all created orders
  }

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

  // Update an order using by user
  async update(payload: UpdateOrderDto) {
    const foundOrder = await this.findOne(payload.id);
    if (!foundOrder || foundOrder.status === 0)
      throw new RpcException({
        message: 'Order not found',
        statusCode: HttpStatus.BAD_REQUEST,
      });
    if (foundOrder.user_id !== payload.user_id)
      throw new RpcException({
        message: 'Forbidden',
        statusCode: HttpStatus.FORBIDDEN,
      });
    if (foundOrder.status > 1) {
      throw new RpcException({
        message:
          'Đơn hàng không thể bị thay đổi, vui lòng liên hệ với nhân viên tư vấn để biết thêm chi tiêt',
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }
    return this.prisma.orders.update({
      where: { id: payload.id },
      data: {
        address_shipping: payload.address_shipping,
      },
    });
  }

  // using by shop
  async changeStateOrder({
    user_id,
    order_id,
    status,
  }: {
    user_id: number;
    order_id: number;
    status: number;
  }) {
    //check owner
    const foundOrder = await this.findOne(order_id);
    if (!foundOrder || foundOrder.status === 0)
      throw new RpcException({
        message: 'Order not found',
        statusCode: HttpStatus.BAD_REQUEST,
      });
    if (foundOrder.res_id !== user_id) {
      throw new RpcException({
        message: 'Forbidden',
        statusCode: HttpStatus.FORBIDDEN,
      });
    }
    return this.prisma.orders.update({
      where: {
        id: order_id,
      },
      data: {
        status: status,
      },
    });
  }

  // Delete an order by ID using by user
  async remove({ user_id, order_id }: { user_id: number; order_id: number }) {
    const foundOrder = await this.findOne(order_id);
    if (!foundOrder || foundOrder.status === 0)
      throw new RpcException({
        message: 'Order not found',
        statusCode: HttpStatus.BAD_REQUEST,
      });
    if (foundOrder.user_id !== user_id)
      throw new RpcException({
        message: 'Forbidden',
        statusCode: HttpStatus.FORBIDDEN,
      });
    if (foundOrder.status > 1) {
      throw new RpcException({
        message:
          'Đơn hàng không thể bị hủy bỏ, vui lòng liên hệ với nhân viên tư vấn để biết thêm chi tiêt',
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }
    const result = await this.prisma.orders.update({
      where: { id: order_id },
      data: {
        status: 0,
      },
    });
    if (!result) {
      throw new RpcException({
        message: 'Có lỗi xảy ra, vui lòng thử lại',
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }
    this.mailService.emit('sendMail', {
      to: 'hau17131203@gmail.com',
      subject: 'Confirm order cancellation',
      template: './order-cancel',
      context: {
        orderId: result.id.toString(),
        supportUrl: 'https://example.com/support',
        year: new Date().getFullYear(),
      },
    });
    return result;
  }
}
