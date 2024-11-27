import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { OrderDetailsService } from './order_details.service';
import { CreateOrderDetailDto } from './dto/create-order_detail.dto';
import { UpdateOrderDetailDto } from './dto/update-order_detail.dto';

@Controller()
export class OrderDetailsController {
  constructor(private readonly orderDetailsService: OrderDetailsService) {}

  // @MessagePattern('createOrderDetail')
  // create(@Payload() createOrderDetailDto: CreateOrderDetailDto) {
  //   return this.orderDetailsService.create(createOrderDetailDto);
  // }

  // @MessagePattern('findAllOrderDetails')
  // findAll() {
  //   return this.orderDetailsService.findAll();
  // }

  // @MessagePattern('findOneOrderDetail')
  // findOne(@Payload() id: number) {
  //   return this.orderDetailsService.findOne(id);
  // }

  // @MessagePattern('updateOrderDetail')
  // update(@Payload() updateOrderDetailDto: UpdateOrderDetailDto) {
  //   return this.orderDetailsService.update(updateOrderDetailDto.id, updateOrderDetailDto);
  // }

  // @MessagePattern('removeOrderDetail')
  // remove(@Payload() id: number) {
  //   return this.orderDetailsService.remove(id);
  // }
}
