import { ClientProxy } from '@nestjs/microservices';
import { Inject, Injectable } from '@nestjs/common';
import { CreateCommentVideoDto } from './dto/create-comment_video.dto';
import { UpdateCommentVideoDto } from './dto/update-comment_video.dto';
import { lastValueFrom } from 'rxjs';
import { handleRetryWithBackoff } from 'src/common/utils/handlerTimeoutWithBackoff';
import { TokenPayload } from 'src/common/dto/tokenPayload.jwt.dto';

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

  findAll() {
    return `This action returns all commentVideo`;
  }

  findOne(id: number) {
    return `This action returns a #${id} commentVideo`;
  }

  update(id: number, updateCommentVideoDto: UpdateCommentVideoDto) {
    return `This action updates a #${id} commentVideo`;
  }

  remove(id: number) {
    return `This action removes a #${id} commentVideo`;
  }
}
