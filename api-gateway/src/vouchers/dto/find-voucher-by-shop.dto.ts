import { PagingDto } from 'src/common/dto/paging.dto';

export class FindVoucherByShopDto extends PagingDto {
  shop_id: number;
}
