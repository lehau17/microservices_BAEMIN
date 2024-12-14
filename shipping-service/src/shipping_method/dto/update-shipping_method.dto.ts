import { PartialType } from '@nestjs/mapped-types';
import { CreateShippingMethodDto } from './create-shipping_method.dto';

export class UpdateShippingMethodDto extends PartialType(CreateShippingMethodDto) {
  id: number;
}
