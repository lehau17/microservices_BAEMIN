import { ClientProxy } from '@nestjs/microservices';
import { Inject, Injectable } from '@nestjs/common';
import { CreateCommentVideoDto } from './dto/create-comment_video.dto';
import { UpdateCommentVideoDto } from './dto/update-comment_video.dto';
import { lastValueFrom } from 'rxjs';
import { handleRetryWithBackoff } from 'src/common/utils/handlerTimeoutWithBackoff';
import { TokenPayload } from 'src/common/dto/tokenPayload.jwt.dto';
import { PagingDto } from 'src/common/dto/paging.dto';

@Injectable()
export class CommentVideoService {
  constructor(
    @Inject('COMMENT_VIDEO_SERVICE')
    private readonly commentVideoService: ClientProxy,
  ) {}
  create(createCommentVideoDto: CreateCommentVideoDto, user: TokenPayload) {
    return lastValueFrom(
      this.commentVideoService
        .send('createCommentVideo', {
          ...createCommentVideoDto,
          user: { id: user.sub, username: user.username, avatar: user.avatar },
        })
        .pipe(handleRetryWithBackoff(3, 1500)),
    );
  }

  findAll(video_id: number, paging: PagingDto) {
    return lastValueFrom(
      this.commentVideoService
        .send('findAllComment', { ...paging, video_id })
        .pipe(handleRetryWithBackoff(3, 1500)),
    );
  }

  findOne(id: number) {
    return `This action returns a #${id} commentVideo`;
  }

  update(
    id: number,
    updateCommentVideoDto: UpdateCommentVideoDto,
    user_id: number,
  ) {
    return lastValueFrom(
      this.commentVideoService
        .send('updateComment', { ...updateCommentVideoDto, id, user_id })
        .pipe(handleRetryWithBackoff(3, 1500)),
    );
  }

  remove(id: number) {
    return `This action removes a #${id} commentVideo`;
  }
}
