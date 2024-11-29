import {
  IsAlpha,
  IsArray,
  IsNotEmpty,
  IsObject,
  IsOptional,
} from 'class-validator';

export class CreateOrderDto {
  @IsNotEmpty()
  @IsArray()
  cart_items: {
    food_id: number;
    quantity: number;
    price: number;
  }[];

  @IsArray()
  voucher_used?: Object[];

  @IsObject()
  @IsOptional()
  address_shipping: object;
}
