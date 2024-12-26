import { Injectable, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit {
  private redis: Redis;

  onModuleInit() {
    // Tạo kết nối Redis khi module được khởi tạo
    this.redis = new Redis({
      host: 'localhost', // Địa chỉ Redis server
      port: 6379, // Cổng mặc định của Redis
      db: 0, // Chỉ định database Redis, mặc định là db 0
    });
    console.log('connected to redis');
  }

  // Phương thức để lấy Redis instance
  getClient(): Redis {
    return this.redis;
  }

  // Phương thức đóng kết nối Redis khi không còn sử dụng
  onModuleDestroy() {
    this.redis.quit();
  }
}
