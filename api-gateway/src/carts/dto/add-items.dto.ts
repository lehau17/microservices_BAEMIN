import { IsInt, Min } from 'class-validator';

export class AddCartItemDto {
  @IsInt()
  food_id: number;
  @IsInt()
  @Min(1)
  quantity: number;
}
