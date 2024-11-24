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
  @IsInt()
  res_id: number;

  @IsNumber()
  @Min(1)
  @Max(5)
  res_rate_point: number;

  @IsString()
  res_rate_comment: string;
}
