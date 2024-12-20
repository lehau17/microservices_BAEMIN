import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsISO8601,
  isBoolean,
  IsOptional,
} from 'class-validator';
import { DiscountType, VoucherType } from 'src/common/types/voucher.type';

export class CreateVoucherDto {
  @IsString()
  @IsNotEmpty()
  vchr_code: string;
  @IsString()
  @IsNotEmpty()
  vchr_discount_type: DiscountType;
  @IsNumber()
  @IsNotEmpty()
  vchr_discount_value: number;
  @IsISO8601()
  @IsNotEmpty()
  vchr_expiration_date: Date;
  @IsString()
  @IsNotEmpty()
  vchr_voucher_type: VoucherType;
  vchr_is_active?: boolean;
  @IsOptional()
  vchr_min_purchase_amount?: number;
  @IsOptional()
  vchr_max_discount?: number;
  @IsOptional()
  vchr_max_quantity?: number;
  @IsOptional()
  vchr_use_quantity?: number;
}
