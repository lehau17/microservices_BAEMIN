// post.service.ts (NestJS)
import { HttpException, Injectable } from '@nestjs/common';
import {
  Client,
  ClientProxy,
  RpcException,
  Transport,
} from '@nestjs/microservices';
import { UpdatePostDto } from './dto/update-post.dto';
import { catchError, lastValueFrom, throwError } from 'rxjs';
import { CreatePostDto } from './dto/create-post.dto';
import { handleRetryWithBackoff } from 'src/common/utils/handlerTimeoutWithBackoff';
import { PagingDto, PagingDtoV2 } from 'src/common/dto/paging.dto';

@Injectable()
export class PostService {
  @Client({
    transport: Transport.RMQ,
    options: {
      urls: [`amqp://admin:1234@localhost:5672`],
      queue: 'go_service_queue',
      queueOptions: {
        durable: true,
      },
      persistent: false,
    },
  })
  client: ClientProxy;

  async create(createPostDto: CreatePostDto) {
    const response = await lastValueFrom(
      this.client.send('create_post_event', createPostDto).pipe(
        handleRetryWithBackoff(3, 1000), // Thử lại 3 lần với độ trễ 1s, 2s, 4s
      ),
    );
    if (response.statusCode && response.statusCode >= 400) {
      throw new HttpException(response.message, response.statusCode);
    }
    return response;
  }

  async findByShop(id: number, paging: PagingDtoV2) {
    const response = await lastValueFrom(
      this.client
        .send('find_all_by_shop', { shop_id: id, ...paging })
        .pipe(handleRetryWithBackoff(3, 1000)),
    );
    if (response.statusCode && response.statusCode >= 400) {
      throw new HttpException(response.message, response.statusCode);
    }
    return response;
  }

  async findAll(paging: PagingDtoV2) {
    const response = await lastValueFrom(
      this.client
        .send('find_all_paging', paging)
        .pipe(handleRetryWithBackoff(3, 1000)),
    );
    if (response.statusCode && response.statusCode >= 400) {
      throw new HttpException(response.message, response.statusCode);
    }
    return response;
  }

  async findOne(id: number) {
    const response = await lastValueFrom(
      this.client.send('find_one_post_event', id).pipe(
        handleRetryWithBackoff(3, 1000), // Thử lại 3 lần với độ trễ 1s, 2s, 4s
      ),
    );
    if (response.statusCode && response.statusCode >= 400) {
      throw new HttpException(response.message, response.statusCode);
    }
    return response;
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  async remove(id: number) {
    const response = await lastValueFrom(
      this.client.send('delete_post', id).pipe(
        handleRetryWithBackoff(3, 1000), // Thử lại 3 lần với độ trễ 1s, 2s, 4s
      ),
    );
    if (response.statusCode && response.statusCode >= 400) {
      throw new HttpException(response.message, response.statusCode);
    }
    return response;
  }
}
