import { IsInt, IsOptional } from 'class-validator';

export class CreateFoodLikeDto {
  @IsInt()
  food_id?: number;
}
