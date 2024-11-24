import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { FoodRatingsService } from './food_ratings.service';
import { CreateFoodRatingDto } from './dto/create-food_rating.dto';
import { UpdateFoodRatingDto } from './dto/update-food_rating.dto';

@Controller()
export class FoodRatingsController {
  constructor(private readonly foodRatingsService: FoodRatingsService) {}

  @MessagePattern('createFoodRating')
  create(@Payload() createFoodRatingDto: CreateFoodRatingDto) {
    return this.foodRatingsService.create(createFoodRatingDto);
  }

  @MessagePattern('findAllFoodRatings')
  findAll() {
    return this.foodRatingsService.findAll();
  }

  @MessagePattern('findOneFoodRating')
  findOne(@Payload() id: number) {
    return this.foodRatingsService.findOne(id);
  }

  @MessagePattern('updateFoodRating')
  update(@Payload() updateFoodRatingDto: UpdateFoodRatingDto) {
    return this.foodRatingsService.update(updateFoodRatingDto);
  }

  @MessagePattern('removeFoodRating')
  remove(@Payload() { user_id, id }: { user_id: number; id: number }) {
    return this.foodRatingsService.remove(id, user_id);
  }
}
