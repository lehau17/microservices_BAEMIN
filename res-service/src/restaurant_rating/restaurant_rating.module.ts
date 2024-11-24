import { Module } from '@nestjs/common';
import { RestaurantRatingService } from './restaurant_rating.service';
import { RestaurantRatingController } from './restaurant_rating.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [RestaurantRatingController],
  providers: [RestaurantRatingService, PrismaService],
})
export class RestaurantRatingModule {}
