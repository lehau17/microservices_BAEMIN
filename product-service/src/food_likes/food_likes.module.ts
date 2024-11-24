import { Module } from '@nestjs/common';
import { FoodLikesService } from './food_likes.service';
import { FoodLikesController } from './food_likes.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { FoodService } from 'src/food/food.service';
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
  controllers: [FoodLikesController],
  providers: [FoodLikesService, PrismaService, FoodService],
})
export class FoodLikesModule {}
