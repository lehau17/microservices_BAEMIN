import { PagingDto } from './../../../res-service/src/common/dto/paging.dto';
import {
  Body,
  Controller,
  Post,
  UseGuards,
  Req,
  Patch,
  Get,
  Param,
  Delete,
} from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/demos/roles.decorator';

@Controller('restaurants')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Post()
  @UseGuards(AccessTokenGuard)
  create(@Body() payload: CreateRestaurantDto, @Req() req) {
    return this.restaurantService.createRestaurant(payload, req.user.sub);
  }
  @Get('/res/me')
  @UseGuards(AccessTokenGuard)
  findResOfMe(@Req() req) {
    return this.restaurantService.findOne(req.user.sub);
  }
  @Get('/:id')
  @UseGuards(AccessTokenGuard)
  findOne(@Param('id') id: string) {
    return this.restaurantService.findOne(+id);
  }

  @Patch()
  @UseGuards(AccessTokenGuard)
  update(@Body() payload: UpdateRestaurantDto, @Req() req) {
    return this.restaurantService.updateRestaurant(payload, req.user.sub);
  }

  @Get()
  findAll(@Param() paging: PagingDto) {
    return this.restaurantService.findAll(paging);
  }

  @Delete('/:id')
  @Roles(['USER'])
  @UseGuards(AccessTokenGuard, RolesGuard)
  remove(@Param('id') id: string) {
    return this.restaurantService.removeRestaurant(+id);
  }
}
