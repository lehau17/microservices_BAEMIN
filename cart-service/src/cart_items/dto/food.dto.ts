export class FindFoodDto {
  id: number;
  res_id: number;
  cate_id: number;
  food_name: string;
  food_description: any;
  food_images: string;
  food_total_like: number;
  food_total_rating: number;
  food_avg_rating: number;
  status: number;
  created_at: string;
  updated_at: string;
  foods_details: {
    id: number;
    food_price: number;
    food_stock: number;
  };
}
