export class CreateFoodDto {
  user_id: number;

  cate_id: number;

  food_name?: string;

  food_description?: string;

  food_images?: string;

  food_price?: number;

  food_stock?: number;
}
