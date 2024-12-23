import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { FoodService } from './food.service';
import { CreateFoodDto } from './dto/create-food.dto';
import { UpdateFoodDto } from './dto/update-food.dto';
import { PagingDto } from 'src/common/dto/paging.dto';
import { FindFoodPayLoadDto } from './dto/find-food.payload.dto';

@Controller()
export class FoodController {
  constructor(private readonly foodService: FoodService) {}

  @MessagePattern('createFood')
  create(@Payload() createFoodDto: CreateFoodDto) {
    return this.foodService.create(createFoodDto);
  }

  @MessagePattern('findAllFood')
  findAll(@Payload() paging: PagingDto) {
    return this.foodService.findAll(paging);
  }

  @MessagePattern('findFoodsPaging')
  findFoodPaging(@Payload() paging: FindFoodPayLoadDto) {
    return this.foodService.findFood(paging);
  }

  @MessagePattern('findOneFood')
  findOne(@Payload() id: number) {
    return this.foodService.findOne(id);
  }

  @MessagePattern('listFoodsByIds')
  findFoodsByIds(@Payload() foodsId: number[]) {
    console.log('vao product');
    return this.foodService.findFoodsByIds(foodsId);
  }

  @MessagePattern('updateFood')
  update(@Payload() updateFoodDto: UpdateFoodDto) {
    return this.foodService.update(updateFoodDto.id, updateFoodDto);
  }

  @MessagePattern('removeFood')
  remove(@Payload() id: number) {
    return this.foodService.remove(id);
  }

  @MessagePattern('desStock')
  updateStock(@Payload() payload: { food_id: number; quantity: number }[]) {
    return this.foodService.desManyStock(payload);
  }

  @MessagePattern('checkStock')
  checkStock(@Payload() payload: { food_id: number; quantity: number }[]) {
    return this.foodService.checkAllStock(payload);
  }
}
