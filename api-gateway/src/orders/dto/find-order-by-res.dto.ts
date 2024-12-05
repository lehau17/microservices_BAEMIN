import { IsInt } from 'class-validator';

export class FindOrderByResDto {
  @IsInt()
  owner_id: number;
}
