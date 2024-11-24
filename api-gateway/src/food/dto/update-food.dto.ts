import { PartialType } from '@nestjs/mapped-types';
import { CreateFoodDto } from './create-food.dto';

export class UpdateFoodDto extends PartialType(CreateFoodDto) {
  food_total_like: number;
  food_total_rating: number;
  food_avg_rating: number;
}
