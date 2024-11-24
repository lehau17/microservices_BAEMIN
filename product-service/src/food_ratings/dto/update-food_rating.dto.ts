import { PartialType } from '@nestjs/mapped-types';
import { CreateFoodRatingDto } from './create-food_rating.dto';

export class UpdateFoodRatingDto {
  id: number;
  user_id: number;
  food_id: number;

  food_rate_point: number;

  food_rate_comment: string;
}
