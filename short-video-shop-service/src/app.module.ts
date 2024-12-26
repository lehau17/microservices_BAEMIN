import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VideoModule } from './video/video.module';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';

import * as redisStore from 'cache-manager-redis-store';
import { PrismaModule } from './prisma/prima.module';

@Module({
  imports: [
    VideoModule,
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        store: redisStore,
        host: configService.get('REDIS_HOST'),
        port: configService.get('REDIS_PORT'),
        auth_pass: configService.get('REDIS_PASSWORD'),
        ttl: configService.get('REDIS_TTL'), // => to second
      }),
      inject: [ConfigService],
      isGlobal: true, // Đặt cache có sẵn trên toàn ứng dụng
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
