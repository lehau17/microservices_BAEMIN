import { IsOptional, IsString, IsInt } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  cate_name: string;

  @IsString()
  cate_description: string;

  @IsString()
  cate_icon: string;

  @IsInt()
  status: number;
}
