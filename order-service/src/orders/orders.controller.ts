import { Controller, UseFilters } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrdersService } from './orders.service';
import { FindOrderByRestaurantDto } from './dto/find-order-by-restaurant.dto';

@Controller()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @MessagePattern('findOrderByShop')
  findOrderByRestaurant(@Payload() payload: FindOrderByRestaurantDto) {
    return this.ordersService.findOrderByRes(payload);
  }

  @MessagePattern('createOrder')
  create(@Payload() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }
  @MessagePattern('findAllOrdersByUser')
  findAll(@Payload() user_id: number) {
    return this.ordersService.findAllByUserId(user_id);
  }
  @MessagePattern('findOneOrder')
  findOne(@Payload() id: number) {
    return this.ordersService.findOne(id);
  }
  @MessagePattern('updateOrderByUser')
  update(@Payload() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(updateOrderDto);
  }

  @MessagePattern('changeStateOrder')
  changeState(
    @Payload()
    payload: {
      user_id: number;
      order_id: number;
      status: number;
    },
  ) {
    return this.ordersService.changeStateOrder(payload);
  }

  @MessagePattern('removeOrderByUser')
  remove(@Payload() payload: { user_id: number; order_id: number }) {
    return this.ordersService.remove(payload);
  }
}
