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
import { Express } from 'express';
import { FoodRatingsService } from './food_ratings.service';
import { CreateFoodRatingDto } from './dto/create-food_rating.dto';
import { UpdateFoodRatingDto } from './dto/update-food_rating.dto';
import { TokenPayload } from 'src/common/dto/tokenPayload.jwt.dto';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { Message } from 'src/common/demos/message.demo';

@Controller('food-ratings')
export class FoodRatingsController {
  constructor(private readonly foodRatingsService: FoodRatingsService) {}

  @Post()
  @UseGuards(AccessTokenGuard)
  @Message('Added food ratings')
  create(
    @Body() createFoodRatingDto: CreateFoodRatingDto,
    @Req() req: Express.Request,
  ) {
    const { sub } = req.user as TokenPayload;
    return this.foodRatingsService.create(createFoodRatingDto, sub);
  }

  // @Get()
  // findAll(
  //   @Query('limit') limit: number,
  //   @Query('skip') skip?: number,
  //   @Query('cursor') cursor?: number,
  // ) {
  //   return this.foodRatingsService.findAll(limit, skip, cursor);
  // }

  // @Get(':id')
  // findOne(@Param('id') id: number) {
  //   return this.foodRatingsService.findOne(id);
  // }

  @Patch(':id')
  @UseGuards(AccessTokenGuard)
  update(
    @Param('id') id: number,
    @Body() updateFoodRatingDto: UpdateFoodRatingDto,
    @Req() req: Express.Request,
  ) {
    const { sub } = req.user as TokenPayload;
    return this.foodRatingsService.update(id, updateFoodRatingDto, sub);
  }

  @Delete(':id')
  @UseGuards(AccessTokenGuard)
  remove(@Param('id') id: number, @Req() req: Express.Request) {
    const { sub } = req.user as TokenPayload;
    return this.foodRatingsService.remove(id, sub);
  }

  // @Post('rate')
  // rateFood(
  //   @Body()
  //   { food_id, food_rate_point, food_rate_comment }: CreateFoodRatingDto,
  //   @Req() req: Express.Request,
  // ) {
  //   const { sub } = req.user as JwtPayload;
  //   return this.foodRatingsService.rateFood(
  //     sub,
  //     food_id,
  //     food_rate_point,
  //     food_rate_comment,
  //   );
  // }

  // @Get('food/:food_id/average')
  // getAverageRating(@Param('food_id') food_id: number) {
  //   return this.foodRatingsService.getAverageRating(food_id);
  // }

  // @Get('user/:user_id/ratings')
  // getUserRatings(
  //   @Param('user_id') user_id: number,
  //   @Query() { cursor, limit = 20, skip = 0 }: PaginationDto,
  // ) {
  //   return this.foodRatingsService.getUserRatings(user_id, {
  //     limit,
  //     skip,
  //     cursor,
  //   });
  // }

  // @Get('/me/list')
  // @UseGuards(AccessTokenGuard)
  // getRatingOfMe(
  //   @Query() { cursor, limit = 20, skip = 0 }: PaginationDto,
  //   @Req() req: Express.Request,
  // ) {
  //   const { sub } = req.user as JwtPayload;
  //   return this.foodRatingsService.getUserRatings(sub, { limit, skip, cursor });
  // }

  // @Get('food/:food_id/ratings')
  // getFoodRatings(@Param('food_id') food_id: number) {
  //   return this.foodRatingsService.getFoodRatings(food_id);
  // }
}
