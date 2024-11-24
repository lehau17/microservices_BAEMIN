import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { FoodLikesService } from './food_likes.service';
import { CreateFoodLikeDto } from './dto/create-food_like.dto';
import { UpdateFoodLikeDto } from './dto/update-food_like.dto';

@Controller()
export class FoodLikesController {
  constructor(private readonly foodLikesService: FoodLikesService) {}

  @MessagePattern('createFoodLike')
  create(@Payload() createFoodLikeDto: CreateFoodLikeDto) {
    return this.foodLikesService.create(createFoodLikeDto);
  }

  @MessagePattern('findAllFoodLikes')
  findAll() {
    return this.foodLikesService.findAll();
  }

  @MessagePattern('findOneFoodLike')
  findOne(@Payload() id: number) {
    return this.foodLikesService.findOne(id);
  }

  @MessagePattern('updateFoodLike')
  update(@Payload() updateFoodLikeDto: UpdateFoodLikeDto) {
    return this.foodLikesService.update(
      updateFoodLikeDto.id,
      updateFoodLikeDto,
    );
  }

  @MessagePattern('removeFoodLike')
  remove(@Payload() { id, user_id }: { id: number; user_id: number }) {
    return this.foodLikesService.remove(id, user_id);
  }

  @MessagePattern('toogleFoodLike')
  toggle(
    @Payload() { food_id, user_id }: { food_id: number; user_id: number },
  ) {
    return this.foodLikesService.toggleLike(food_id, user_id);
  }
}
