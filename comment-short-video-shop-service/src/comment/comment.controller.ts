import { PagingDto } from 'src/common/dto/paging.dto';
import { Controller } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @MessagePattern('createCommentVideo')
  create(@Payload() createCommentDto: CreateCommentDto) {
    return this.commentService.create(createCommentDto);
  }

  @MessagePattern('findAllComment')
  findAll(@Payload() paging: PagingDto & { video_id: number }) {
    return this.commentService.findAll(paging);
  }

  @MessagePattern('findOneComment')
  findOne(@Payload('id') id: string) {
    return this.commentService.findOne(+id);
  }

  @MessagePattern('updateComment')
  update(@Payload() updateCommentDto: UpdateCommentDto) {
    return this.commentService.update(updateCommentDto);
  }

  @MessagePattern('deleteComment')
  remove(@Payload('id') id: string) {
    return this.commentService.remove(+id);
  }
}
