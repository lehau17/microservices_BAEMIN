import { Inject, Injectable } from '@nestjs/common';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { handleRetryWithBackoff } from 'src/common/utils/handlerTimeoutWithBackoff';

@Injectable()
export class VideoService {
  constructor(
    @Inject('VIDEO_SERVICE') private readonly videoService: ClientProxy,
  ) {}
  create(createVideoDto: CreateVideoDto, shop_id: number) {
    return lastValueFrom(
      this.videoService
        .send('createVideo', { ...createVideoDto, shop_id })
        .pipe(handleRetryWithBackoff(3, 2000)),
    );
  }

  findAll() {
    return `This action returns all video`;
  }

  findOne(id: number) {
    return `This action returns a #${id} video`;
  }

  update(id: number, updateVideoDto: UpdateVideoDto) {
    return `This action updates a #${id} video`;
  }

  remove(id: number) {
    return `This action removes a #${id} video`;
  }
}
