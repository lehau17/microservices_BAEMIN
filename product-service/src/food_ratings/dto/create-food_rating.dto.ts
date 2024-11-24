import { IsInt, IsString, IsOptional, Max, Min } from 'class-validator';

export class CreateFoodRatingDto {
  user_id: number;
  food_id: number;

  food_rate_point: number;

  food_rate_comment: string;
}
