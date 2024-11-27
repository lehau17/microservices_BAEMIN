export class CreateVoucherDto {
  code: string;
  discount_percent: number;
  discount_amount: number;
  minimum_order: number;
  valid_from: Date;
  valid_to: Date;
  status: number;
}
