import { Global, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { VouchersModule } from './vouchers/vouchers.module';
import { AddressesModule } from './addresses/addresses.module';
import { OrderDetailsModule } from './order_details/order_details.module';
import { OrdersModule } from './orders/orders.module';
@Global()
@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), VouchersModule, AddressesModule, OrderDetailsModule, OrdersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
