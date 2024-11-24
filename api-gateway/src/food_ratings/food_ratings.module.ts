import { Module } from '@nestjs/common';
import { FoodRatingsService } from './food_ratings.service';
import { FoodRatingsController } from './food_ratings.controller';
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
  controllers: [FoodRatingsController],
  providers: [FoodRatingsService],
})
export class FoodRatingsModule {}
