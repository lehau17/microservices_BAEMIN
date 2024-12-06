import { Module } from '@nestjs/common';
import { VoucherUsageService } from './voucher-usage.service';
import { VoucherUsageController } from './voucher-usage.controller';

@Module({
  controllers: [VoucherUsageController],
  providers: [VoucherUsageService],
})
export class VoucherUsageModule {}
