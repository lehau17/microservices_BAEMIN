import { Inject, Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { ClientProxy } from '@nestjs/microservices';
import { handleRetryWithBackoff } from 'src/common/utils/handlerTimeoutWithBackoff';

@Injectable()
export class CommentService {
  constructor(
    @Inject('COMMENT_SERVICE') private readonly commentService: ClientProxy,
  ) {}
  create(createCommentDto: CreateCommentDto, user_id: number, email: string) {
    return this.commentService
      .send('create_comment', {
        ...createCommentDto,
        user_id,
        email,
        username: new Date().toISOString(),
      })
      .pipe(handleRetryWithBackoff(3, 2000));
  }

  findAll() {
    return `This action returns all comment`;
  }

  findOne(id: number) {
    return `This action returns a #${id} comment`;
  }

  update(id: number, updateCommentDto: UpdateCommentDto) {
    return `This action updates a #${id} comment`;
  }

  remove(id: number) {
    return `This action removes a #${id} comment`;
  }
}
