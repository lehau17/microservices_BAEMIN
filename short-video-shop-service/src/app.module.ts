import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VideoModule } from './video/video.module';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule } from '@nestjs/config';

import * as redisStore from 'cache-manager-redis-store';
import { PrismaModule } from './prisma/prima.module';
import { ScheduleModule } from '@nestjs/schedule';
import { RedisModule } from './redis/redis.module';
import { RedisService } from './redis/redis.service';
@Module({
  imports: [
    ScheduleModule.forRoot(),
    VideoModule,
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    RedisModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
