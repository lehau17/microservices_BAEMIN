import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Prisma } from '@prisma/client';
import { CreateCategoryDto } from './dto/create-category.dto';
import { lastValueFrom } from 'rxjs';
import { handleRetryWithBackoff } from 'src/common/utils/handlerTimeoutWithBackoff';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(@Inject('PRODUCT_SERVICE') private productService: ClientProxy) {}

  async create(data: CreateCategoryDto) {
    return lastValueFrom(
      this.productService
        .send('createCategory', data)
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
      this.productService
        .send('findAllCategories', { limit, skip, cursor })
        .pipe(handleRetryWithBackoff(3, 1000)),
    );
  }

  async findOne(id: number) {
    return lastValueFrom(
      this.productService
        .send('findOneCategory', id)
        .pipe(handleRetryWithBackoff(3, 1000)),
    );
  }

  async update(id: number, data: UpdateCategoryDto) {
    return lastValueFrom(
      this.productService
        .send('updateCategory', { id, ...data })
        .pipe(handleRetryWithBackoff(3, 1000)),
    );
  }

  async remove(id: number) {
    return lastValueFrom(
      this.productService
        .send('removeCategory', id)
        .pipe(handleRetryWithBackoff(3, 1000)),
    );
  }
}
