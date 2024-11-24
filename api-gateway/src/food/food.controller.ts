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
  Req,
} from '@nestjs/common';
import { FoodService } from './food.service';
import { CreateFoodDto } from './dto/create-food.dto';
import { UpdateFoodDto } from './dto/update-food.dto';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';

@Controller('foods')
export class FoodController {
  constructor(private readonly foodService: FoodService) {}

  @Post()
  @UseGuards(AccessTokenGuard)
  create(@Body() createFoodDto: CreateFoodDto, @Req() req) {
    console.log('Check user', req.user);
    return this.foodService.create(createFoodDto, req.user.sub);
  }

  @Get('/search')
  searchFood(
    @Query('limit') limit = 20,
    @Query('skip') skip = 0,
    @Query('cursor') cursor?: number,
    @Query('name') name?: string,
    @Query('cate_id') cate_id?: string,
    @Query('c_time') c_time?: string,
    @Query('from_price') from_price = 0,
    @Query('to_price') to_price?: string,
    // 1: mới nhất, 2. cũ , 0 : kệ nó
  ) {
    return this.foodService.findFood({
      limit,
      skip,
      cursor,
      name,
      cate: +cate_id,
      c_time: +c_time,
      from_price: Number(from_price),
      to_price: Number(to_price),
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.foodService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AccessTokenGuard)
  update(@Param('id') id: number, @Body() updateFoodDto: UpdateFoodDto) {
    return this.foodService.update(id, updateFoodDto);
  }

  @Delete(':id')
  @UseGuards(AccessTokenGuard)
  remove(@Param('id') id: number) {
    return this.foodService.remove(id);
  }
}
