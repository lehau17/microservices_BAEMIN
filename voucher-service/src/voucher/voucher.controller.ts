import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { VoucherService } from './voucher.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateVoucherDto } from './dto/create-voucher.dto';
import { UpdateVoucherDto } from './dto/update-voucher.dto';

@Controller('vouchers')
export class VoucherController {
  constructor(private readonly vouchersService: VoucherService) {}

  // Endpoint tạo voucher
  @MessagePattern('createVoucher')
  async create(@Payload() createVoucherDto: CreateVoucherDto) {
    return this.vouchersService.create(createVoucherDto);
  }

  // Endpoint lấy tất cả voucher
  @MessagePattern('find-all-vouchers')
  async findAll(@Payload() payload: any) {
    return this.vouchersService.findAll();
  }

  // Endpoint lấy voucher theo ID
  @MessagePattern('find-one-voucher')
  async findOne(@Payload() id: string) {
    return this.vouchersService.findOne(Number(id));
  }

  // Endpoint cập nhật voucher
  @MessagePattern('update-voucher')
  async update(@Payload() { id, ...updateVoucherDto }: UpdateVoucherDto) {
    return this.vouchersService.update(Number(id), updateVoucherDto);
  }

  @MessagePattern('removeVoucher')
  async remove(@Payload() id: string) {
    return this.vouchersService.remove(Number(id));
  }
}
