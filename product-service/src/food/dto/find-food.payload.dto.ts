import { PagingDto } from 'src/common/dto/paging.dto';

export class FindFoodPayLoadDto extends PagingDto {
  name?: string;
  cate?: number;
  c_time?: number;
  from_price?: number;
  to_price?: number;
}
