import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  title: string;
  @IsString()
  @IsNotEmpty()
  content: string;
  @IsInt()
  @IsNotEmpty()
  shop_id: number;
  @IsString()
  @IsNotEmpty()
  hashtag: string;
  @IsString()
  @IsNotEmpty()
  status: string;
}
