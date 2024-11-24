import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RestaurantRatingService } from './restaurant_rating.service';
import { CreateRestaurantRatingDto } from './dto/create-restaurant_rating.dto';
import { UpdateRestaurantRatingDto } from './dto/update-restaurant_rating.dto';
import { PagingDto } from 'src/common/dto/paging.dto';

@Controller()
export class RestaurantRatingController {
  constructor(
    private readonly restaurantRatingService: RestaurantRatingService,
  ) {}

  @MessagePattern('createRestaurantRating')
  create(
    @Payload()
    createRestaurantRatingDto: CreateRestaurantRatingDto,
  ) {
    return this.restaurantRatingService.create(createRestaurantRatingDto);
  }

  @MessagePattern('findAllRestaurantRating')
  findAll(@Payload() paging: PagingDto) {
    return this.restaurantRatingService.findAll(paging);
  }

  @MessagePattern('findAllRestaurantRatingByRes')
  findByRes(@Payload() paging: PagingDto & { id: number }) {
    return this.restaurantRatingService.findAllByRes(paging);
  }

  @MessagePattern('findOneRestaurantRating')
  findOne(@Payload() id: number) {
    return this.restaurantRatingService.findOne(id);
  }

  @MessagePattern('updateRestaurantRating')
  update(@Payload() updateRestaurantRatingDto: UpdateRestaurantRatingDto) {
    return this.restaurantRatingService.update(
      updateRestaurantRatingDto.id,
      updateRestaurantRatingDto,
    );
  }

  @MessagePattern('removeRestaurantRating')
  remove(@Payload() { id, user_id }: { id: number; user_id: number }) {
    return this.restaurantRatingService.remove(id, user_id);
  }

  @MessagePattern('listUserRating')
  listUserRating(@Payload() user_id: number) {
    return this.restaurantRatingService.getUserRatings(+user_id);
  }
}
