import { Inject, Injectable } from '@nestjs/common';
import { CreateVoucherUsageDto } from './dto/create-voucher-usage.dto';
import { UpdateVoucherUsageDto } from './dto/update-voucher-usage.dto';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class VoucherUsageService {
  constructor(@Inject('RESTAURANT_SERVICE') private resService: ClientProxy) {}

  create(createVoucherUsageDto: CreateVoucherUsageDto) {
    return 'This action adds a new voucherUsage';
  }

  findAll() {
    return `This action returns all voucherUsage`;
  }

  findOne(id: number) {
    return `This action returns a #${id} voucherUsage`;
  }

  update(id: number, updateVoucherUsageDto: UpdateVoucherUsageDto) {
    return `This action updates a #${id} voucherUsage`;
  }

  remove(id: number) {
    return `This action removes a #${id} voucherUsage`;
  }
}
