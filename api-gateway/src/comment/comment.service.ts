import { HttpException, Inject, Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { ClientProxy } from '@nestjs/microservices';
import { handleRetryWithBackoff } from 'src/common/utils/handlerTimeoutWithBackoff';
import { lastValueFrom } from 'rxjs';
import { PagingDtoV2 } from 'src/common/dto/paging.dto';

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

  async findAll(id: number, paging: PagingDtoV2) {
    const response = await lastValueFrom(
      this.commentService
        .send('find_all_by_post', {
          ...paging,
          post_id: id,
        })
        .pipe(handleRetryWithBackoff(3, 2000)),
    );
    if (response.statusCode && response.statusCode >= 400) {
      throw new HttpException(response.message, response.statusCode);
    }
    return response;
  }

  findOne(id: number) {
    return `This action returns a #${id} comment`;
  }

  async countCommentByPost(post_id: number) {
    const response = await lastValueFrom(
      this.commentService
        .send('count_comment_by_post', post_id)
        .pipe(handleRetryWithBackoff(3, 2000)),
    );
    if (response.statusCode && response.statusCode >= 400) {
      throw new HttpException(response.message, response.statusCode);
    }
    return response;
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
