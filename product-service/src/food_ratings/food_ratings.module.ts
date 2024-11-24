import { Module } from '@nestjs/common';
import { FoodRatingsService } from './food_ratings.service';
import { FoodRatingsController } from './food_ratings.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [FoodRatingsController],
  providers: [FoodRatingsService, PrismaService],
})
export class FoodRatingsModule {}
