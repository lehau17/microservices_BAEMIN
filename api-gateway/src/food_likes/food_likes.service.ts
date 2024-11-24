import { Injectable, Controller, Inject } from '@nestjs/common';
import { CreateFoodLikeDto } from './dto/create-food_like.dto';
import { UpdateFoodLikeDto } from './dto/update-food_like.dto';
import { lastValueFrom } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';
import { handleRetryWithBackoff } from 'src/common/utils/handlerTimeoutWithBackoff';

@Injectable()
export class FoodLikesService {
  constructor(@Inject('PRODUCT_SERVICE') private ProductService: ClientProxy) {}
  create(createFoodLikeDto: CreateFoodLikeDto, user_id: number) {
    return lastValueFrom(
      this.ProductService.send('createFoodLike', {
        ...createFoodLikeDto,
        user_id,
      }).pipe(handleRetryWithBackoff(3, 1000)),
    );
  }

  remove(id: number, user_id: number) {
    return lastValueFrom(
      this.ProductService.send('removeFoodLike', {
        id,
        user_id,
      }).pipe(handleRetryWithBackoff(3, 1000)),
    );
  }

  toogleFoodLike(food_id: number, user_id: number) {
    return lastValueFrom(
      this.ProductService.send('toogleFoodLike', {
        food_id,
        user_id,
      }).pipe(handleRetryWithBackoff(3, 1000)),
    );
  }
}
