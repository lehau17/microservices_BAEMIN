import { Inject, Injectable } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { AddCartItemDto } from './dto/add-items.dto';
import { lastValueFrom } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';
import { handleRetryWithBackoff } from 'src/common/utils/handlerTimeoutWithBackoff';

@Injectable()
export class CartsService {
  constructor(@Inject('USER_SERVICE') private userService: ClientProxy) {}
  create(body: AddCartItemDto, user_id: number) {
    return lastValueFrom(
      this.userService
        .send('createCartItem', { ...body, user_id })
        .pipe(handleRetryWithBackoff(3, 1000)),
    );
  }

  getCart(user_id: number) {
    return lastValueFrom(
      this.userService
        .send('getCarts', user_id)
        .pipe(handleRetryWithBackoff(3, 1000)),
    );
  }

  update(id: number, updateCartDto: UpdateCartDto, user_id: number) {
    return lastValueFrom(
      this.userService
        .send('updateCartItem', { id, ...updateCartDto, user_id })
        .pipe(handleRetryWithBackoff(3, 1000)),
    );
  }

  remove(id: number, user_id: number) {
    return lastValueFrom(
      this.userService
        .send('removeCartItem', { id, user_id })
        .pipe(handleRetryWithBackoff(3, 1000)),
    );
  }
}
