import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateCommentDto {
  @IsInt()
  @IsNotEmpty()
  post_id: number;
  @IsString()
  @IsNotEmpty()
  content: string;
}
