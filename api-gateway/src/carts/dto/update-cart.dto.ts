import { IsInt, IsOptional, min, Min } from 'class-validator';

export class UpdateCartDto {
  @IsInt()
  @Min(1)
  food_id?: number;
  @Min(1)
  quantity?: number;
}
