import { Global, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VoucherModule } from './voucher/voucher.module';
import { VoucherUsageModule } from './voucher-usage/voucher-usage.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
@Global()
@Module({
  imports: [VoucherModule, VoucherUsageModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
