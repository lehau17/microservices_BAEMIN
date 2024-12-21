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

  findAll() {
    return `This action returns all post`;
  }

  findOne(id: number) {
    return `This action returns a #${id} post`;
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
