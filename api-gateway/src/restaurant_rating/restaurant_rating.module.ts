import { Module } from '@nestjs/common';
import { RestaurantRatingService } from './restaurant_rating.service';
import { RestaurantRatingController } from './restaurant_rating.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'RESTAURANT_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://admin:1234@localhost:5672'],
          queue: 'restaurant_queue',
          queueOptions: {
            durable: true,
          },
          persistent: true,
        },
      },
    ]),
  ],
  controllers: [RestaurantRatingController],
  providers: [RestaurantRatingService],
})
export class RestaurantRatingModule {}
