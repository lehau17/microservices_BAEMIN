import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateRestaurantRatingDto } from './create-restaurant_rating.dto';

export class UpdateRestaurantRatingDto extends PartialType(
  OmitType(CreateRestaurantRatingDto, ['res_id'] as const),
) {}
