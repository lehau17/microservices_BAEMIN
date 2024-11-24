import { IsInt, IsOptional } from 'class-validator';

export class CreateFoodLikeDto {
  food_id?: number;
  user_id: number;
}
