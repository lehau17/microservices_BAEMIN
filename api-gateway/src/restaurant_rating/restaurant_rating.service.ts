import { Inject, Injectable } from '@nestjs/common';
import { CreateRestaurantRatingDto } from './dto/create-restaurant_rating.dto';
import { UpdateRestaurantRatingDto } from './dto/update-restaurant_rating.dto';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { handleRetryWithBackoff } from 'src/common/utils/handlerTimeoutWithBackoff';

@Injectable()
export class RestaurantRatingService {
  constructor(@Inject('RESTAURANT_SERVICE') private resService: ClientProxy) {}
  async create(data: CreateRestaurantRatingDto, user_id: number) {
    return lastValueFrom(
      this.resService
        .send('createRestaurantRating', { ...data, user_id })
        .pipe(handleRetryWithBackoff(3, 1000)),
    );
  }

  async findAll({
    limit = 20,
    skip = 0,
    cursor,
  }: {
    limit?: number;
    skip?: number;
    cursor?: number;
  }) {
    return lastValueFrom(
      this.resService
        .send('findAllRestaurantRating', { limit, skip, cursor })
        .pipe(handleRetryWithBackoff(3, 1000)),
    );
  }

  findOne(id: number) {
    return `This action returns a #${id} restaurantRating`;
  }

  async findAllByRes({
    limit = 20,
    skip = 0,
    cursor,
    id,
  }: {
    limit?: number;
    skip?: number;
    cursor?: number;
    id: number;
  }) {
    return lastValueFrom(
      this.resService
        .send('findAllRestaurantRatingByRes', { limit, skip, cursor, id })
        .pipe(handleRetryWithBackoff(3, 1000)),
    );
  }

  async update(id: number, data: UpdateRestaurantRatingDto, user_id: number) {
    return lastValueFrom(
      this.resService
        .send('updateRestaurantRating', { id, user_id, ...data })
        .pipe(handleRetryWithBackoff(3, 1000)),
    );
  }

  async remove(id: number, user_id: number) {
    return lastValueFrom(
      this.resService
        .send('removeRestaurantRating', { id, user_id })
        .pipe(handleRetryWithBackoff(3, 1000)),
    );
  }

  async getUserRatings(user_id: number) {
    return lastValueFrom(
      this.resService
        .send('listUserRating', user_id)
        .pipe(handleRetryWithBackoff(3, 1000)),
    );
  }
}
