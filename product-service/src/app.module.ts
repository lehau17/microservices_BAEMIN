import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoriesModule } from './categories/categories.module';
import { FoodModule } from './food/food.module';
import { FoodLikesModule } from './food_likes/food_likes.module';
import { FoodRatingsModule } from './food_ratings/food_ratings.module';
import { PrismaModule } from './prisma/prima.module';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    CategoriesModule,
    FoodModule,
    FoodLikesModule,
    FoodRatingsModule,
    PrismaModule,
    ClientsModule.register([
      {
        name: 'RESTAURANT_SERVICE',
        transport: Transport.RMQ,

        options: {
          urls: [
            `amqp://${process.env.RABBITMQ_USER || 'admin'}:${process.env.RABBITMQ_PASSWORD || '1234'}@${process.env.RABBITMQ_HOST || 'some-rabbit'}:5672`,
          ],
          queue: 'restaurant_queue',
          queueOptions: {
            durable: true,
          },
          persistent: true,
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
