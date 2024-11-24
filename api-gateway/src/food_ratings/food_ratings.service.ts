import { ClientProxy } from '@nestjs/microservices';
import { Inject, Injectable } from '@nestjs/common';
import { CreateFoodRatingDto } from './dto/create-food_rating.dto';
import { UpdateFoodRatingDto } from './dto/update-food_rating.dto';
import { lastValueFrom } from 'rxjs';
import { handleRetryWithBackoff } from 'src/common/utils/handlerTimeoutWithBackoff';

@Injectable()
export class FoodRatingsService {
  constructor(
    @Inject('PRODUCT_SERVICE') private producrtService: ClientProxy,
  ) {}
  async create(data: CreateFoodRatingDto, user_id: number) {
    return lastValueFrom(
      this.producrtService
        .send('createFoodRating', { ...data, user_id })
        .pipe(handleRetryWithBackoff(3, 1000)),
    );
  }

  findAll() {
    return `This action returns all foodRatings`;
  }

  findOne(id: number) {
    return `This action returns a #${id} foodRating`;
  }

  update(
    id: number,
    updateFoodRatingDto: UpdateFoodRatingDto,
    user_id: number,
  ) {
    return lastValueFrom(
      this.producrtService
        .send('updateFoodRating', { ...updateFoodRatingDto, user_id, id })
        .pipe(handleRetryWithBackoff(3, 1000)),
    );
  }

  remove(id: number, user_id: number) {
    return lastValueFrom(
      this.producrtService
        .send('removeFoodRating', { user_id, id })
        .pipe(handleRetryWithBackoff(3, 1000)),
    );
  }
}
