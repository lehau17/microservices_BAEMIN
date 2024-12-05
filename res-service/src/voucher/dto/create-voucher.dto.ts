import { VoucherType } from 'src/common/types/voucher.type';
import { DiscountType } from 'src/common/types/voucher.type';

export class CreateVoucherDto {
  shop_id?: number;
  vchr_code: string;
  vchr_discount_type: DiscountType;
  vchr_discount_value: number;
  vchr_expiration_date: Date;
  vchr_voucher_type: VoucherType;
  vchr_is_active?: boolean;
  vchr_min_purchase_amount?: number;
  vchr_max_discount?: number;
}
