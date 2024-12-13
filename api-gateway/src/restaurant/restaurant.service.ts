import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { lastValueFrom } from 'rxjs';
import { UpdateAuthDto } from 'src/auth/dto/update-auth.dto';
import { handleRetryWithBackoff } from 'src/common/utils/handlerTimeoutWithBackoff';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { PagingDto } from 'src/common/dto/paging.dto';
import { UpdateAddressDto } from './dto/update-address-restaurant.dto';

@Injectable()
export class RestaurantService {
  constructor(@Inject('RESTAURANT_SERVICE') private resService: ClientProxy) {}

  async createRestaurant(payload: CreateRestaurantDto, user_id: number) {
    const newRestaurant = await lastValueFrom(
      this.resService
        .send('createRestaurant', {
          ...payload,
          id: user_id,
        })
        .pipe(handleRetryWithBackoff(3, 1000)),
    );
    return newRestaurant;
  }

  async updateRestaurant(payload: UpdateRestaurantDto, id: number) {
    return lastValueFrom(
      this.resService.send('updateRestaurant', { ...payload, id }),
    );
  }

  async findOne(id: number) {
    return lastValueFrom(
      this.resService
        .send('findOneRestaurant', id)
        .pipe(handleRetryWithBackoff(3, 1000)),
    );
  }

  async findAll(paging: PagingDto) {
    return lastValueFrom(this.resService.send('FindAllRestaurants', paging));
  }

  async removeRestaurant(id: number) {
    return lastValueFrom(this.resService.send('removeRestaurant', id));
  }

  async updateAddress(id: number, payload: UpdateAddressDto) {
    return lastValueFrom(
      this.resService.send('updateAddressRestaurant', { id, ...payload }),
    );
  }
}
