import { Module } from '@nestjs/common';
import { VoucherService } from './voucher.service';
import { VoucherController } from './voucher.controller';
import { PrismaModule } from 'src/prisma/prima.module';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [VoucherController],
  providers: [VoucherService, PrismaService],
})
export class VoucherModule {}
