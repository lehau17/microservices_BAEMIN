import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CreateVoucherDto } from './dto/create-voucher.dto';
import { PagingDto } from 'src/common/dto/paging.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateVoucherDto } from './dto/update-voucher.dto';

@Injectable()
export class VouchersService {
  constructor(private prisma: PrismaService) {}

  // Create a new voucher
  async create(data: CreateVoucherDto) {
    return this.prisma.vouchers.create({ data });
  }

  // Find all vouchers
  async findAll({ limit = 20, cursor, skip }: PagingDto) {
    const options: Prisma.vouchersFindManyArgs = {
      take: limit,
    };

    if (cursor) {
      options.skip = 1;
      options.cursor = { id: cursor };
    } else if (skip) {
      options.skip = skip;
    }

    const data = await this.prisma.vouchers.findMany(options);
    return {
      data: data,
      filter: {
        limit,
        skip,
      },
      cursor: {
        prevCursor: cursor,
        nextCursor: data.length > limit ? data[length - 1].id : null,
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
    return this.prisma.vouchers.update({
      where: { id: data.id },
      data,
    });
  }

  // Delete a voucher by ID
  async remove(id: number) {
    return this.prisma.vouchers.update({
      where: { id },
      data: {
        status: 0,
      },
    });
  }
}
