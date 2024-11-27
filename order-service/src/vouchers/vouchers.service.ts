import { HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CreateVoucherDto } from './dto/create-voucher.dto';
import { PagingDto } from 'src/common/dto/paging.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateVoucherDto } from './dto/update-voucher.dto';
import { FindVoucherDto } from './dto/find-vopucher.dto';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class VouchersService {
  constructor(private prisma: PrismaService) {}

  // Create a new voucher
  async create(data: CreateVoucherDto) {
    return this.prisma.vouchers.create({
      data: { ...data, status: data.status || 1 },
    });
  }

  // Find all vouchers
  async findAll({
    limit = 20,
    cursor,
    skip,
    c_time = 1,
    code,
    from,
    to,
    to_price,
  }: FindVoucherDto) {
    const options: Prisma.vouchersFindManyArgs = {
      take: +limit,
      orderBy: {
        created_at: c_time === 1 ? 'desc' : 'asc',
      },
      where: {
        minimum_order: to_price
          ? {
              lte: to_price,
            }
          : undefined,
        valid_from: from
          ? {
              gte: new Date(from),
            }
          : undefined,
        valid_to: to
          ? {
              lte: new Date(to),
            }
          : undefined,
        code: code
          ? {
              contains: code,
            }
          : undefined,
      },
    };

    if (cursor) {
      options.skip = 1;
      options.cursor = { id: cursor };
    } else if (skip) {
      options.skip = +skip;
    }

    const data = await this.prisma.vouchers.findMany(options);
    return {
      data: data,
      filter: {
        limit,
        cursor,
        skip,
        c_time,
        code,
        from,
        to,
      },
      cursor: {
        prevCursor: cursor,
        nextCursor: data.length > limit ? data[data.length - 1].id : null,
      },
    };
  }

  async findOneByCode(code: string) {
    return this.prisma.vouchers.findUnique({
      where: { code },
    });
  }

  // Find a single voucher by ID
  async findOne(id: number) {
    return this.prisma.vouchers.findUnique({
      where: { id },
    });
  }

  // Update a voucher
  async update(data: UpdateVoucherDto) {
    const foundVoucher = await this.prisma.vouchers.findFirst({
      where: { id: data.id },
    });
    if (!foundVoucher || foundVoucher.status === 0) {
      throw new RpcException({
        message: 'Voucher not found',
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }
    return this.prisma.vouchers.update({
      where: { id: data.id },
      data,
    });
  }

  // Delete a voucher by ID
  async remove(id: number) {
    const foundVoucher = await this.prisma.vouchers.findFirst({
      where: { id },
    });
    if (!foundVoucher || foundVoucher.status === 0) {
      throw new RpcException({
        message: 'Voucher not found',
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }
    return this.prisma.vouchers.update({
      where: { id },
      data: {
        status: 0,
      },
    });
  }
}
