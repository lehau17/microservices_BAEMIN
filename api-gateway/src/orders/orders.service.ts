import { userDto } from 'src/common/dto/user.dto';
import { Inject, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { lastValueFrom } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';
import { handleRetryWithBackoff } from 'src/common/utils/handlerTimeoutWithBackoff';
import { ChangeStateOrderDto } from './dto/change-state-order.dto';
import { PagingDto } from 'src/common/dto/paging.dto';

@Injectable()
export class OrdersService {
  constructor(@Inject('ORDER_SERVICE') private orderService: ClientProxy) {}
  create(createOrderDto: CreateOrderDto, user_id: number, email: string) {
    return lastValueFrom(
      this.orderService
        .send('createOrder', { ...createOrderDto, user_id, email })
        .pipe(handleRetryWithBackoff(3, 1000)),
    );
  }

  findOrderByShop(ownerId: number, paging: PagingDto) {
    return lastValueFrom(
      this.orderService
        .send('findOrderByShop', { ownerId, ...paging })
        .pipe(handleRetryWithBackoff(3, 1000)),
    );
  }

  findAll(user_id: number) {
    return lastValueFrom(
      this.orderService
        .send('findAllOrdersByUser', user_id)
        .pipe(handleRetryWithBackoff(3, 1000)),
    );
  }

  findOne(id: number) {
    return lastValueFrom(
      this.orderService
        .send('findOneOrder', id)
        .pipe(handleRetryWithBackoff(3, 1000)),
    );
  }

  update(id: number, user_id: number, payload: UpdateOrderDto) {
    return lastValueFrom(
      this.orderService
        .send('updateOrderByUser', { id, user_id, ...payload })
        .pipe(handleRetryWithBackoff(3, 1000)),
    );
  }

  remove(id: number, user_id: number) {
    return lastValueFrom(
      this.orderService
        .send('removeOrderByUser', { order_id: id, user_id })
        .pipe(handleRetryWithBackoff(3, 1000)),
    );
  }

  async changeState(id: number, user_id: number, payload: ChangeStateOrderDto) {
    return lastValueFrom(
      this.orderService
        .send('removeOrderByUser', { user_id, order_id: id, ...payload })
        .pipe(handleRetryWithBackoff(3, 1000)),
    );
  }
}
