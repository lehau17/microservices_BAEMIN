import { Injectable } from '@nestjs/common';
import { CreateCommentVideoDto } from './dto/create-comment_video.dto';
import { UpdateCommentVideoDto } from './dto/update-comment_video.dto';

@Injectable()
export class CommentVideoService {
  create(createCommentVideoDto: CreateCommentVideoDto) {
    return 'This action adds a new commentVideo';
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
