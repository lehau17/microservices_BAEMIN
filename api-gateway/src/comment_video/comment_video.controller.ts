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
import { CommentVideoService } from './comment_video.service';
import { CreateCommentVideoDto } from './dto/create-comment_video.dto';
import { UpdateCommentVideoDto } from './dto/update-comment_video.dto';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { TokenPayload } from 'src/common/dto/tokenPayload.jwt.dto';
import { PagingDto } from 'src/common/dto/paging.dto';

@Controller('comment-video')
export class CommentVideoController {
  constructor(private readonly commentVideoService: CommentVideoService) {}

  @Post()
  @UseGuards(AccessTokenGuard)
  create(
    @Body() createCommentVideoDto: CreateCommentVideoDto,
    @Req() req: Express.Request,
  ) {
    const tokenPayload = req.user as TokenPayload;
    return this.commentVideoService.create(createCommentVideoDto, tokenPayload);
  }

  @Get(':id/video')
  findAll(@Param('id') id: string, @Query() paging: PagingDto) {
    return this.commentVideoService.findAll(+id, paging);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentVideoService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCommentVideoDto: UpdateCommentVideoDto,
  ) {
    return this.commentVideoService.update(+id, updateCommentVideoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commentVideoService.remove(+id);
  }
}
