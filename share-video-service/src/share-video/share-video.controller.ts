import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ShareVideoService } from './share-video.service';
import { CreateShareVideoDto } from './dto/create-share-video.dto';
import { UpdateShareVideoDto } from './dto/update-share-video.dto';

@Controller()
export class ShareVideoController {
  constructor(private readonly shareVideoService: ShareVideoService) {}

  @MessagePattern('createShareVideo')
  create(@Payload() createShareVideoDto: CreateShareVideoDto) {
    return this.shareVideoService.create(createShareVideoDto);
  }

  @MessagePattern('findAllShareVideo')
  findAll() {
    return this.shareVideoService.findAll();
  }

  @MessagePattern('findOneShareVideo')
  findOne(@Payload() id: number) {
    return this.shareVideoService.findOne(id);
  }

  @MessagePattern('updateShareVideo')
  update(@Payload() updateShareVideoDto: UpdateShareVideoDto) {
    return this.shareVideoService.update(updateShareVideoDto.id, updateShareVideoDto);
  }

  @MessagePattern('removeShareVideo')
  remove(@Payload() id: number) {
    return this.shareVideoService.remove(id);
  }
}
