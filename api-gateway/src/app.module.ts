import { Global, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { RestaurantModule } from './restaurant/restaurant.module';
import { RestaurantRatingModule } from './restaurant_rating/restaurant_rating.module';
import { CategoriesModule } from './categories/categories.module';
import { FoodModule } from './food/food.module';
import { FoodLikesModule } from './food_likes/food_likes.module';
import { FoodRatingsModule } from './food_ratings/food_ratings.module';
import { CartsModule } from './carts/carts.module';

@Global()
@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'USER_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://admin:1234@localhost:5672'],
          queue: 'user_queue',
          queueOptions: {
            durable: true,
          },
          persistent: true,
        },
      },
      {
        name: 'CART_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://admin:1234@localhost:5672'],
          queue: 'cart_queue',
          queueOptions: {
            durable: true,
          },
          persistent: true,
        },
      },
    ]),
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true }),
    RestaurantModule,
    RestaurantRatingModule,
    CategoriesModule,
    FoodModule,
    FoodLikesModule,
    FoodRatingsModule,
    CartsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
