import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateRestaurantDto } from './createRestaurant.dto';

export class UpdateRestaurantDto extends PartialType(CreateRestaurantDto) {
  id: number;
}
