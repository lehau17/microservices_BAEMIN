import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateCartItemDto } from './dto/create-cart_item.dto';
import { UpdateCartItemDto } from './dto/update-cart_item.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { UserService } from 'src/user/user.service';
import { lastValueFrom, retry, timeout, catchError } from 'rxjs';
import { FindFoodDto } from './dto/food.dto';

@Injectable()
export class CartItemsService {
  constructor(
    private prismaService: PrismaService,
    private userService: UserService,
    @Inject('PRODUCT_SERVICE') private productService: ClientProxy,
  ) {}
  async create(payload: CreateCartItemDto) {
    const [foundFood, foundUser, foundCartItem] = await Promise.all([
      await lastValueFrom(
        this.productService.send('findOneFood', payload.food_id),
      ),
      await this.userService.findOne(payload.user_id),
      await this.prismaService.cart_items.findFirst({
        where: {
          cart_id: payload.user_id,
          food_id: payload.food_id,
        },
      }),
    ]);
    if (!foundFood || foundFood.status === 0) {
      throw new RpcException({
        message: 'not found food',
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }
    if (!foundUser || foundUser.status === 0) {
      throw new RpcException({
        message: 'not found',
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }
    if (foundFood.foods_details.food_stock < payload.quantity) {
      throw new RpcException({
        message: ' out of stock',
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }
    let newItem = null;
    if (foundCartItem) {
      newItem = await this.prismaService.cart_items.update({
        where: {
          id: foundCartItem.id,
        },
        data: {
          quantity: foundCartItem.quantity + payload.quantity,
          updated_at: new Date(),
          price:
            (foundCartItem.quantity + payload.quantity) *
            foundFood.foods_details.food_price,
        },
      });
    }
    newItem = await this.prismaService.cart_items.create({
      data: {
        food_id: foundFood.id,
        carts: {
          connect: {
            id: foundUser.id,
          },
        },
        quantity: payload.quantity,
        status: 1,
        price: payload.quantity * foundFood.foods_details.food_price,
      },
    });

    return newItem;
  }

  // Update a cart item by ID
  async update({ id, food_id, quantity, user_id }: UpdateCartItemDto) {
    const [foundFood, foundUser, foundCartItem] = await Promise.all([
      await lastValueFrom(this.productService.send('findOneFood', food_id)),
      await this.userService.findOne(user_id),
      await this.prismaService.cart_items.findFirst({
        where: {
          id,
        },
      }),
    ]);
    if (!foundFood || foundFood.status === 0) {
      throw new RpcException({
        message: 'not found food',
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }
    if (!foundUser || foundUser.status === 0) {
      throw new RpcException({
        message: 'not found',
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }
    if (
      !foundCartItem ||
      foundCartItem.cart_id !== user_id ||
      foundCartItem.food_id !== food_id
    )
      throw new RpcException({
        message: 'invalid request',
        statusCode: HttpStatus.BAD_REQUEST,
      });
    return this.prismaService.cart_items.update({
      where: { id },
      data: {
        quantity,
      },
    });
  }

  findOne(id: number) {
    return this.prismaService.cart_items.findFirst({ where: { id } });
  }

  async remove(id: number, user_id: number) {
    const cart_items = await this.findOne(id);
    if (!cart_items) {
      throw new RpcException({
        message: 'No cart items found',
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }
    if (cart_items.cart_id !== user_id) {
      throw new RpcException({
        message: 'forbidden',
        statusCode: HttpStatus.FORBIDDEN,
      });
    }
    return this.prismaService.cart_items.delete({
      where: { id },
    });
  }

  async getItemUser(user_id: number) {
    const foundUser = await this.userService.findOne(user_id);

    if (!foundUser || foundUser.status === 0) {
      throw new RpcException({
        message: 'not found',
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }
    const cartItem = await this.prismaService.cart_items.findMany({
      where: {
        cart_id: user_id,
      },
    });
    const foodIds = cartItem.map((item) => item.food_id);
    if (foodIds.length > 0) {
      const foods = await lastValueFrom(
        this.productService
          .send('listFoodsByIds', foodIds)
          .pipe(retry(4), timeout(4000)),
      );
      return cartItem.map((item) => {
        return { ...item, food: foods[item.food_id] || {} };
      });
    }
    return cartItem;
  }

  removeItems({ user_id, food_id }: { user_id: number; food_id: number[] }) {
    return this.prismaService.cart_items.deleteMany({
      where: {
        cart_id: user_id,
        food_id: {
          in: food_id,
        },
      },
    });
  }
}
