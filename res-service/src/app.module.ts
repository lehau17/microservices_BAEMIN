import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RestaurantModule } from './restaurant/restaurant.module';
import { RestaurantRatingModule } from './restaurant_rating/restaurant_rating.module';

@Module({
  imports: [RestaurantModule, RestaurantRatingModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
