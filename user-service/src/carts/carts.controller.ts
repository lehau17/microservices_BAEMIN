import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CartsService } from './carts.service';

@Controller()
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @MessagePattern('createCart')
  create(@Payload() user_id: number) {
    return this.cartsService.create(user_id);
  }

  @MessagePattern('findOneCart')
  findOne(@Payload() id: number) {
    return this.cartsService.findOne(id);
  }
}
