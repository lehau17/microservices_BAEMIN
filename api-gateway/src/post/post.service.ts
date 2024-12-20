// post.service.ts (NestJS)
import { Injectable } from '@nestjs/common';
import { Client, ClientProxy, Transport } from '@nestjs/microservices';
import { UpdatePostDto } from './dto/update-post.dto';
import { catchError, lastValueFrom, throwError } from 'rxjs';

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

  async create(createPostDto: any) {
    const message = { text: createPostDto.text };
    const response = await lastValueFrom(
      this.client.send('create_post_event', message).pipe(
        catchError((err, response) => {
          console.log(err, response);
          return throwError(err); // This should be throwError, not returning the error directly.
        }),
      ),
    );
    console.log(response);

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
