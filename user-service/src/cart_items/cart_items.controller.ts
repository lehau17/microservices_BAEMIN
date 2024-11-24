import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CartItemsService } from './cart_items.service';
import { CreateCartItemDto } from './dto/create-cart_item.dto';
import { UpdateCartItemDto } from './dto/update-cart_item.dto';

@Controller()
export class CartItemsController {
  constructor(private readonly cartItemsService: CartItemsService) {}

  @MessagePattern('createCartItem')
  create(@Payload() createCartItemDto: CreateCartItemDto) {
    return this.cartItemsService.create(createCartItemDto);
  }

  @MessagePattern('findOneCartItem')
  findOne(@Payload() id: number) {
    return this.cartItemsService.findOne(id);
  }
  @MessagePattern('getCarts')
  getCarts(@Payload() user_id: number) {
    return this.cartItemsService.getItemUser(user_id);
  }

  @MessagePattern('updateCartItem')
  update(@Payload() updateCartItemDto: UpdateCartItemDto) {
    return this.cartItemsService.update(updateCartItemDto);
  }

  @MessagePattern('removeCartItem')
  remove(@Payload() { id, user_id }: { id: number; user_id: number }) {
    return this.cartItemsService.remove(id, user_id);
  }
}
