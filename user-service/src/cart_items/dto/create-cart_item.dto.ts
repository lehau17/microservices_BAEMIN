import { IsIn, IsInt, isInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateCartItemDto {
  food_id: number;
  user_id: number;
  quantity: number;
}
