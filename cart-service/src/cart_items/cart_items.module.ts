import { Module } from '@nestjs/common';
import { CartItemsService } from './cart_items.service';
import { CartItemsController } from './cart_items.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { CartsService } from 'src/carts/carts.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'PRODUCT_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [
            `amqp://${process.env.RABBITMQ_USER || 'admin'}:${process.env.RABBITMQ_PASSWORD || '1234'}@${process.env.RABBITMQ_HOST || 'localhost'}:5672`,
          ],
          queue: 'product_queue',
          queueOptions: {
            durable: true,
          },
          persistent: false,
        },
      },
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
    ]),
  ],
  controllers: [CartItemsController],
  providers: [CartItemsService, PrismaService, ConfigService, CartsService],
})
export class CartItemsModule {}
