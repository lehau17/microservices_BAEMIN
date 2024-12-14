import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ShippingMethodModule } from './shipping_method/shipping_method.module';
import { PrismaModule } from './prisma/prima.module';
import { PrismaService } from './prisma/prisma.service';
import { ShippingModule } from './shipping/shipping.module';

@Module({
  imports: [PrismaModule, ShippingMethodModule, ShippingModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
