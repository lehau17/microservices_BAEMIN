import { Global, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { RestaurantModule } from './restaurant/restaurant.module';
import { RestaurantRatingModule } from './restaurant_rating/restaurant_rating.module';
import { CategoriesModule } from './categories/categories.module';
import { FoodModule } from './food/food.module';
import { FoodLikesModule } from './food_likes/food_likes.module';
import { FoodRatingsModule } from './food_ratings/food_ratings.module';
import { CartsModule } from './carts/carts.module';
import { UploadModule } from './upload/upload.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { VouchersModule } from './vouchers/vouchers.module';
import { AddressesModule } from './addresses/addresses.module';
import { OrdersModule } from './orders/orders.module';
import { VoucherUsageModule } from './voucher-usage/voucher-usage.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { PostModule } from './post/posts.module';
import { CommentModule } from './comment/comment.module';
import { VideoModule } from './video/video.module';

@Global()
@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 60,
      },
    ]),
    ClientsModule.register([
      {
        name: 'USER_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [
            `amqp://${process.env.RABBITMQ_USER || 'admin'}:${process.env.RABBITMQ_PASSWORD || '1234'}@${process.env.RABBITMQ_HOST || 'localhost'}:5672`,
          ],
          queue: 'user_queue',
          queueOptions: {
            durable: true,
          },
          persistent: true,
        },
      },
      {
        name: 'POST_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [
            `amqp://${process.env.RABBITMQ_USER || 'admin'}:${process.env.RABBITMQ_PASSWORD || '1234'}@${process.env.RABBITMQ_HOST || 'localhost'}:5672`,
          ],
          queue: 'post_queue',
          queueOptions: {
            durable: true,
          },
          persistent: false,
        },
      },
      {
        name: 'UPLOAD_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [
            `amqp://${process.env.RABBITMQ_USER || 'admin'}:${process.env.RABBITMQ_PASSWORD || '1234'}@${process.env.RABBITMQ_HOST || 'localhost'}:5672`,
          ],
          queue: 'upload_queue',
          queueOptions: {
            durable: false,
          },
          persistent: true,
        },
      },
      {
        name: 'CART_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [
            `amqp://${process.env.RABBITMQ_USER || 'admin'}:${process.env.RABBITMQ_PASSWORD || '1234'}@${process.env.RABBITMQ_HOST || 'localhost'}:5672`,
          ],
          queue: 'cart_queue',
          queueOptions: {
            durable: true,
          },
          persistent: true,
        },
      },
      {
        name: 'ORDER_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [
            `amqp://${process.env.RABBITMQ_USER || 'admin'}:${process.env.RABBITMQ_PASSWORD || '1234'}@${process.env.RABBITMQ_HOST || 'localhost'}:5672`,
          ],
          queue: 'order_queue',
          queueOptions: {
            durable: false,
          },
          persistent: true,
        },
      },
      {
        name: 'MAIL_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [
            `amqp://${process.env.RABBITMQ_USER || 'admin'}:${process.env.RABBITMQ_PASSWORD || '1234'}@${process.env.RABBITMQ_HOST || 'localhost'}:5672`,
          ],
          queue: 'mail_queue',
          queueOptions: {
            durable: true,
          },
          persistent: true,
        },
      },
      {
        name: 'VOUCHER_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [
            `amqp://${process.env.RABBITMQ_USER || 'admin'}:${process.env.RABBITMQ_PASSWORD || '1234'}@${process.env.RABBITMQ_HOST || 'localhost'}:5672`,
          ],
          queue: 'voucher_queue',
          queueOptions: {
            durable: false,
          },
          persistent: true,
        },
      },
    ]),
    AuthModule,
    ServeStaticModule.forRoot({
      rootPath: '.',
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    RestaurantModule,
    RestaurantRatingModule,
    CategoriesModule,
    FoodModule,
    FoodLikesModule,
    FoodRatingsModule,
    CartsModule,
    UploadModule,
    VouchersModule,
    AddressesModule,
    OrdersModule,
    VoucherUsageModule,
    PostModule,
    CommentModule,
    VideoModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
