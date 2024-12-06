import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, voucher_usage } from '@prisma/client';
import { VoucherUsage } from './entities/voucher-usage.entity';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class VoucherUsageService {
  constructor(private prisma: PrismaService) {}

  // Tạo VoucherUsage mới
  // DI vào order check hết rồi không cần check
  async create(data: Prisma.voucher_usageCreateInput): Promise<voucher_usage> {
    return this.prisma.voucher_usage.create({
      data,
    });
  }

  // Lấy tất cả VoucherUsage
  async findAll(): Promise<voucher_usage[]> {
    return this.prisma.voucher_usage.findMany();
  }

  // Lấy VoucherUsage theo ID
  async findOne(id: number): Promise<voucher_usage | null> {
    return this.prisma.voucher_usage.findUnique({
      where: { id },
    });
  }

  // Cập nhật VoucherUsage
  async update(
    id: number,
    data: Prisma.voucher_usageUpdateInput,
  ): Promise<voucher_usage> {
    return this.prisma.voucher_usage.update({
      where: { id },
      data,
    });
  }

  // Xóa VoucherUsage
  async remove(id: number): Promise<voucher_usage> {
    return this.prisma.voucher_usage.delete({
      where: { id },
    });
  }
}
