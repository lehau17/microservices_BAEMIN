import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PagingDto, PagingDtoV2 } from 'src/common/dto/paging.dto';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @UseGuards(AccessTokenGuard)
  create(@Body() createPostDto: CreatePostDto) {
    return this.postService.create(createPostDto);
  }

  @Post(':id/increase-like')
  @UseGuards(AccessTokenGuard)
  increaseLike(@Param('id') id: string) {
    return this.postService.increaseOneLike(+id);
  }

  @Post(':id/descrease-like')
  @UseGuards(AccessTokenGuard)
  desreaseLike(@Param('id') id: string) {
    return this.postService.decreaseOneLike(+id);
  }
  @Get()
  @UseGuards(AccessTokenGuard)
  findAll(@Query() paging: PagingDtoV2) {
    return this.postService.findAll(paging);
  }

  @Get(':id')
  @UseGuards(AccessTokenGuard)
  findOne(@Param('id') id: string) {
    return this.postService.findOne(+id);
  }

  @Get('/shop/:id')
  findByShop(@Param('id') id: string, paging: PagingDtoV2) {
    return this.postService.findByShop(+id, paging);
  }

  @Patch(':id')
  @UseGuards(AccessTokenGuard)
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postService.update(+id, updatePostDto);
  }

  @Delete(':id')
  @UseGuards(AccessTokenGuard)
  remove(@Param('id') id: string) {
    return this.postService.remove(+id);
  }
}
