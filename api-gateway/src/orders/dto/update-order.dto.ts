import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderDto } from './create-order.dto';
import { IsObject } from 'class-validator';

export class UpdateOrderDto {
  @IsObject()
  address_shipping: Object;
}
