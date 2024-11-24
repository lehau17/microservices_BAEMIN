import 'reflect-metadata';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroServiceExceptionFilter } from 'src/common/filters/MicroServiceExceptionFilter';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
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
  );
  await app.listen();
}
bootstrap();
