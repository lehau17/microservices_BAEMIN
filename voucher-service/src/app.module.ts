import { Global, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VoucherModule } from './voucher/voucher.module';
import { VoucherUsageModule } from './voucher-usage/voucher-usage.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prima.module';
@Global()
@Module({
  imports: [VoucherModule, VoucherUsageModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
