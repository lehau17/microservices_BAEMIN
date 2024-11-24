import {
  IsInt,
  IsOptional,
  IsString,
  IsNumber,
  IsNotEmpty,
} from 'class-validator';

export class CreateFoodDto {
  @IsNotEmpty()
  @IsInt()
  cate_id: number;

  @IsNotEmpty()
  @IsString()
  food_name?: string;

  @IsOptional()
  @IsString()
  food_description?: string;

  @IsNotEmpty()
  @IsString()
  food_images?: string;

  @IsNotEmpty()
  @IsNumber()
  food_price?: number;

  @IsNotEmpty()
  @IsInt()
  food_stock?: number;
}
