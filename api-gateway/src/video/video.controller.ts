import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { VideoService } from './video.service';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { TokenPayload } from 'src/common/dto/tokenPayload.jwt.dto';
import { PagingDto } from 'src/common/dto/paging.dto';

@Controller('video')
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @Post()
  @UseGuards(AccessTokenGuard)
  create(@Body() createVideoDto: CreateVideoDto, @Req() req: Express.Request) {
    const { sub } = req.user as TokenPayload;
    return this.videoService.create(createVideoDto, sub);
  }

  @Get()
  findAll(@Query() paging: PagingDto) {
    return this.videoService.findAll(paging);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.videoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVideoDto: UpdateVideoDto) {
    return this.videoService.update(+id, updateVideoDto);
  }

  @Delete(':id')
  @UseGuards(AccessTokenGuard)
  remove(@Param('id') id: string, @Req() req: Express.Request) {
    const { sub } = req.user as TokenPayload;
    return this.videoService.remove(+id, sub);
  }

  @Patch(':id/view')
  increaseView(@Param('id') id: string) {
    return this.videoService.increaseView(+id);
  }
  @Patch(':id/like')
  increaseLike(@Param('id') id: string) {
    return this.videoService.increaseLike(+id);
  }
}
