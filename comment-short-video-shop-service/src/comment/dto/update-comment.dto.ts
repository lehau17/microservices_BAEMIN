import { PartialType } from '@nestjs/mapped-types';
import { CreateCommentDto } from './create-comment.dto';

export class UpdateCommentDto {
  id: number;
  content: string;
  user_id: number;
}
