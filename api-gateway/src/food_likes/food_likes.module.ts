import { Module } from '@nestjs/common';
import { FoodLikesService } from './food_likes.service';
import { FoodLikesController } from './food_likes.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'PRODUCT_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://admin:1234@localhost:5672'],
          queue: 'product_queue',
          queueOptions: {
            durable: true,
          },
          persistent: false,
        },
      },
    ]),
  ],
  controllers: [FoodLikesController],
  providers: [FoodLikesService],
})
export class FoodLikesModule {}
