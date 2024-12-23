import { HttpException, Inject, Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { ClientProxy } from '@nestjs/microservices';
import { handleRetryWithBackoff } from 'src/common/utils/handlerTimeoutWithBackoff';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class CommentService {
  constructor(
    @Inject('COMMENT_SERVICE') private readonly commentService: ClientProxy,
  ) {}
  async create(
    createCommentDto: CreateCommentDto,
    user_id: number,
    email: string,
  ) {
    const response = await lastValueFrom(
      this.commentService
        .send('create_comment', {
          ...createCommentDto,
          user_id,
          email,
          username: new Date().toISOString(),
        })
        .pipe(handleRetryWithBackoff(3, 2000)),
    );
    if (response.statusCode && response.statusCode >= 400) {
      throw new HttpException(response.message, response.statusCode);
    }
    return response;
  }

  findAll() {
    return `This action returns all comment`;
  }

  findOne(id: number) {
    return `This action returns a #${id} comment`;
  }

  async update(
    id: number,
    updateCommentDto: UpdateCommentDto,
    user_id: number,
  ) {
    const response = await lastValueFrom(
      this.commentService
        .send('update_comment', { id, ...updateCommentDto, user_id })
        .pipe(handleRetryWithBackoff(3, 2000)),
    );
    if (response.statusCode && response.statusCode >= 400) {
      throw new HttpException(response.message, response.statusCode);
    }
    return response;
  }

  async remove(id: number, user_id: number) {
    const response = await lastValueFrom(
      this.commentService
        .send('delete_comment', id)
        .pipe(handleRetryWithBackoff(3, 2000)),
    );
    if (response.statusCode && response.statusCode >= 400) {
      throw new HttpException(response.message, response.statusCode);
    }
    return response;
  }
}
