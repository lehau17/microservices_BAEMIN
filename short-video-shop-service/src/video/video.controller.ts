import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { VideoService } from './video.service';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { PagingDto } from 'src/common/utils/paging/paging';

@Controller()
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @MessagePattern('createVideo')
  create(@Payload() createVideoDto: CreateVideoDto) {
    return this.videoService.create(createVideoDto);
  }

  @MessagePattern('findAllVideo')
  findAll(@Payload() paging: PagingDto) {
    return this.videoService.findAll(paging);
  }

  @MessagePattern('findOneVideo')
  findOne(@Payload() id: number) {
    return this.videoService.findOne(id);
  }

  @MessagePattern('updateVideo')
  update(@Payload() updateVideoDto: UpdateVideoDto) {
    return this.videoService.update(updateVideoDto);
  }

  @MessagePattern('removeVideo')
  remove(@Payload() { id, shop_id }: { id: number; shop_id: number }) {
    return this.videoService.remove(id, shop_id);
  }

  @MessagePattern('increaseView')
  increaseView(@Payload() id: number) {
    return this.videoService.increateViewRedis(id);
  }

  @MessagePattern('increaseLike')
  increaseLike(@Payload() id: number) {
    return this.videoService.increateLikeRedis(id);
  }
}
