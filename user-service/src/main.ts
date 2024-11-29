import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { RpcExceptionFilter } from './common/filters/RpcExceptionGatewayFilter';
import { UserServiceExceptionFilter } from './common/filters/UserServiceExceptionFilter';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [
          `amqp://${process.env.RABBITMQ_USER || 'admin'}:${process.env.RABBITMQ_PASSWORD || '1234'}@${process.env.RABBITMQ_HOST || 'some-rabbit'}:5672`,
        ],
        queue: 'user_queue',
        queueOptions: {
          durable: true,
        },
        persistent: true,
      },
    },
  );
  // app.useGlobalFilters(new MicroServiceExceptionFilter());
  // app.useGlobalFilters(new RpcExceptionFilter());
  // app.useGlobalFilters(new UserServiceExceptionFilter());
  await app.listen();
}
bootstrap();
