export class CreateOrderDto {
  user_id: number;
  cart_items: {
    food_id: number;
    quantity: number;
    price: number;
  }[];
  voucher_used?: Object[];
  address_shipping: object;
}
