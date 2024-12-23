import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  Query,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { TokenPayload } from 'src/common/dto/tokenPayload.jwt.dto';
import { PagingDtoV2 } from 'src/common/dto/paging.dto';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  @UseGuards(AccessTokenGuard)
  create(
    @Body() createCommentDto: CreateCommentDto,
    @Req() req: Express.Request,
  ) {
    const { sub, username } = req.user as TokenPayload;
    return this.commentService.create(createCommentDto, sub, username);
  }

  @Get('post/:id')
  findAll(@Query() paging: PagingDtoV2, @Param('id') id: string) {
    return this.commentService.findAll(+id, paging);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AccessTokenGuard)
  update(
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @Req() req: Express.Request,
  ) {
    const { sub } = req.user as TokenPayload;

    return this.commentService.update(+id, updateCommentDto, sub);
  }

  @Delete(':id')
  @UseGuards(AccessTokenGuard)
  remove(@Param('id') id: string, @Req() req: Express.Request) {
    const { sub } = req.user as TokenPayload;
    return this.commentService.remove(+id, sub);
  }
}
