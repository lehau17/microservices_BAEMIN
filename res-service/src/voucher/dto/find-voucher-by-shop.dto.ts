import { PagingDto } from 'src/common/dto/paging.dto';

export class FindVoucherByShopDto extends PagingDto {
  shop_id: number;
  vchr_is_active?: boolean;
  from_date?: Date;
  to_date?: Date;
  from_discount_value?: number;
  to_discount_value?: number;
  vchr_code: string;
}
