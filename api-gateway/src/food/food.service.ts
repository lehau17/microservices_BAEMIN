import { Inject, Injectable } from '@nestjs/common';
import { CreateFoodDto } from './dto/create-food.dto';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { handleRetryWithBackoff } from 'src/common/utils/handlerTimeoutWithBackoff';
import { UpdateFoodDto } from './dto/update-food.dto';

@Injectable()
export class FoodService {
  constructor(@Inject('PRODUCT_SERVICE') private productService: ClientProxy) {}
  create(createFoodDto: CreateFoodDto, id: number) {
    return lastValueFrom(
      this.productService
        .send('createFood', {
          user_id: id,
          ...createFoodDto,
        })
        .pipe(handleRetryWithBackoff(3, 1000)),
    );
  }

  findFood(paging: {
    limit: number;
    skip: number;
    cursor: number;
    name: string;
    cate: number;
    c_time: number;
    from_price: number;
    to_price: number;
  }) {
    return lastValueFrom(
      this.productService
        .send('findFoodsPaging', paging)
        .pipe(handleRetryWithBackoff(3, 1000)),
    );
  }

  findOne(id: number) {
    return lastValueFrom(
      this.productService
        .send('findOneFood', id)
        .pipe(handleRetryWithBackoff(3, 1000)),
    );
  }

  update(id: number, data: UpdateFoodDto) {
    return lastValueFrom(
      this.productService
        .send('updateFood', { id, ...data })
        .pipe(handleRetryWithBackoff(3, 1000)),
    );
  }

  remove(id: number) {
    return lastValueFrom(
      this.productService
        .send('removeFood', id)
        .pipe(handleRetryWithBackoff(3, 1000)),
    );
  }
}
