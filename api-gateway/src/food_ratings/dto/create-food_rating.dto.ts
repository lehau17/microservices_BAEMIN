import { IsInt, IsString, IsOptional, Max, Min } from 'class-validator';

export class CreateFoodRatingDto {
  @IsInt()
  food_id: number;

  @IsInt()
  @Min(1)
  @Max(5)
  food_rate_point: number;

  @IsString()
  food_rate_comment: string;
}
