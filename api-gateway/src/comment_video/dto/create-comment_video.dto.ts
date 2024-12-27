import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCommentVideoDto {
  @IsInt()
  @IsNotEmpty()
  video_id: number;
  @IsString()
  @IsNotEmpty()
  content: string;
  @IsInt()
  @IsOptional()
  parent_id: number;
}
