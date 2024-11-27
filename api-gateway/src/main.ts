import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/HttpException';
import { TransformInterceptor } from './common/interceptors/handler_response';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
async function bootstrap() {
  // const logger = WinstonModule.createLogger({
  //   defaultMeta: { service: 'API Gateway' },
  //   transports: [
  //     new winston.transports.Http({
  //       host: 'localhost',
  //       port: 5044,
  //       level: 'error',
  //     }),
  //   ],
  // });
  const app = await NestFactory.create(AppModule);
  // Sử dụng ValidationPipe toàn cục
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Chuyển đổi dữ liệu vào DTO
      whitelist: true, // Loại bỏ các thuộc tính không được định nghĩa trong DTO
      forbidNonWhitelisted: true, // Báo lỗi nếu có thuộc tính không hợp lệ
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new TransformInterceptor(new Reflector()));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
