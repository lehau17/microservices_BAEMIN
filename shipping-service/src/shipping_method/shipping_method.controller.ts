import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ShippingMethodService } from './shipping_method.service';
import { CreateShippingMethodDto } from './dto/create-shipping_method.dto';
import { UpdateShippingMethodDto } from './dto/update-shipping_method.dto';

@Controller()
export class ShippingMethodController {
  constructor(private readonly shippingMethodService: ShippingMethodService) {}

  @MessagePattern('createShippingMethod')
  create(@Payload() createShippingMethodDto: CreateShippingMethodDto) {
    return this.shippingMethodService.create(createShippingMethodDto);
  }

  @MessagePattern('findAllShippingMethod')
  findAll() {
    return this.shippingMethodService.findAll();
  }

  @MessagePattern('findOneShippingMethod')
  findOne(@Payload() id: number) {
    return this.shippingMethodService.findOne(id);
  }

  @MessagePattern('updateShippingMethod')
  update(@Payload() updateShippingMethodDto: UpdateShippingMethodDto) {
    return this.shippingMethodService.update(updateShippingMethodDto);
  }

  @MessagePattern('removeShippingMethod')
  remove(@Payload() id: number) {
    return this.shippingMethodService.remove(id);
  }
}
