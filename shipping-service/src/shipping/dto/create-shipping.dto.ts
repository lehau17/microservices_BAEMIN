import { ShippingStatus } from '@prisma/client';

export class CreateShippingDto {
  order_id: number;
  customer_id: number;
  address: Object;
  shipping_method_id: number;
  shipping_date: Date;
  estimated_delivery: Date;
  tracking_number: string;
}
