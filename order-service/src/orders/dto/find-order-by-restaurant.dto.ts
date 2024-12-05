import { PagingDto } from 'src/common/dto/paging.dto';

export class FindOrderByRestaurantDto extends PagingDto {
  ownerId: number;
}
