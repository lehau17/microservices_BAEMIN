import { Global, Module } from '@nestjs/common';
import { FoodService } from './food.service';
import { FoodController } from './food.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
@Global()
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
  controllers: [FoodController],
  providers: [FoodService, PrismaService],
  exports: [FoodService],
})
export class FoodModule {}
