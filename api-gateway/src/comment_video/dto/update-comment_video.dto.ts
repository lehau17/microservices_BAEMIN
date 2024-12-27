import { PartialType } from '@nestjs/mapped-types';
import { CreateCommentVideoDto } from './create-comment_video.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateCommentVideoDto {
  @IsString()
  @IsNotEmpty()
  content: string;
}
