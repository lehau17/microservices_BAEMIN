import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderDto } from './create-order.dto';

export class UpdateOrderDto {
  id: number;
  user_id: number;
  address_shipping: object;
}
