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
} from '@nestjs/common';
import { FoodLikesService } from './food_likes.service';
import { CreateFoodLikeDto } from './dto/create-food_like.dto';
import { UpdateFoodLikeDto } from './dto/update-food_like.dto';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { TokenPayload } from 'src/common/dto/tokenPayload.jwt.dto';

@Controller('food-likes')
export class FoodLikesController {
  constructor(private readonly foodLikesService: FoodLikesService) {}

  @Post()
  @UseGuards(AccessTokenGuard)
  create(
    @Body() createFoodLikeDto: CreateFoodLikeDto,
    @Req() req: Express.Request,
  ) {
    const { sub } = req.user as TokenPayload;
    return this.foodLikesService.create(createFoodLikeDto, sub);
  }

  @Post('toogle/:id')
  @UseGuards(AccessTokenGuard)
  toggleFoodLike(@Param('id') id: string, @Req() req: Express.Request) {
    const { sub } = req.user as TokenPayload;
    return this.foodLikesService.toogleFoodLike(+id, sub);
  }
  @Delete(':id')
  @UseGuards(AccessTokenGuard)
  remove(@Param('id') id: string, @Req() req: Express.Request) {
    const { sub } = req.user as TokenPayload;
    return this.foodLikesService.remove(+id, sub);
  }
}
