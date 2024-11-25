import { Global, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { VouchersModule } from './vouchers/vouchers.module';
import { AddressesModule } from './addresses/addresses.module';
@Global()
@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), VouchersModule, AddressesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
