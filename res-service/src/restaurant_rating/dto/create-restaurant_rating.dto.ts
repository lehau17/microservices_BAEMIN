import {
  IsDecimal,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateRestaurantRatingDto {
  user_id: number;
  res_id: number;

  res_rate_point: number;

  res_rate_comment: string;
}
