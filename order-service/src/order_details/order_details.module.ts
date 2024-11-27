import { Module } from '@nestjs/common';
import { OrderDetailsService } from './order_details.service';
import { OrderDetailsController } from './order_details.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [OrderDetailsController],
  providers: [OrderDetailsService, PrismaService],
})
export class OrderDetailsModule {}
