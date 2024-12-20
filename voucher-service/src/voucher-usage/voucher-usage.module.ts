import { Module } from '@nestjs/common';
import { VoucherUsageService } from './voucher-usage.service';
import { VoucherUsageController } from './voucher-usage.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [VoucherUsageController],
  providers: [VoucherUsageService, PrismaService],
})
export class VoucherUsageModule {}
