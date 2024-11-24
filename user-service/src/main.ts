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
        urls: ['amqp://admin:1234@localhost:5672'],
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
