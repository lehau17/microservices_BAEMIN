import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';

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
    ]),
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
  controllers: [OrdersController],
  providers: [],
})
export class OrdersModule {}
