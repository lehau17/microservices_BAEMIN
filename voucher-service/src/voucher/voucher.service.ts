import { HttpStatus, Injectable } from '@nestjs/common';
import { Prisma, vouchers } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateVoucherDto } from './dto/create-voucher.dto';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class VoucherService {
  constructor(private prisma: PrismaService) {}

  // Tạo voucher mới
  async create(data: CreateVoucherDto): Promise<vouchers> {
    const foundVoucher = await this.prisma.vouchers.findFirst({
      where: {
        vchr_code: data.vchr_code,
      },
    });
    if (foundVoucher) {
      throw new RpcException({
        message: 'Voucher đã tồn tại',
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }
    return this.prisma.vouchers.create({
      data,
    });
  }

  // Lấy tất cả voucher
  async findAll(): Promise<vouchers[]> {
    return this.prisma.vouchers.findMany();
  }

  // Lấy voucher theo ID
  async findOne(id: number): Promise<vouchers | null> {
    return this.prisma.vouchers.findUnique({
      where: { id },
    });
  }

  // Cập nhật voucher
  async update(
    id: number,
    data: Prisma.vouchersUpdateInput,
  ): Promise<vouchers> {
    return this.prisma.vouchers.update({
      where: { id },
      data,
    });
  }

  // Xóa voucher
  async remove(id: number): Promise<vouchers> {
    return this.prisma.vouchers.delete({
      where: { id },
    });
  }
}
