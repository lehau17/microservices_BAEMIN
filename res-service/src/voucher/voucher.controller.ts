import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { VoucherService } from './voucher.service';
import { CreateVoucherDto } from './dto/create-voucher.dto';
import { UpdateVoucherDto } from './dto/update-voucher.dto';

@Controller()
export class VoucherController {
  constructor(private readonly voucherService: VoucherService) {}

  @MessagePattern('createVoucher')
  create(@Payload() createVoucherDto: CreateVoucherDto) {
    return this.voucherService.create(createVoucherDto);
  }

  @MessagePattern('findAllVoucher')
  findAll() {
    return this.voucherService.findAll();
  }

  @MessagePattern('findOneVoucher')
  findOne(@Payload() id: number) {
    return this.voucherService.findOne(id);
  }

  @MessagePattern('updateVoucher')
  update(@Payload() updateVoucherDto: UpdateVoucherDto) {
    return this.voucherService.update(updateVoucherDto.id, updateVoucherDto);
  }

  @MessagePattern('removeVoucher')
  remove(@Payload() id: number) {
    return this.voucherService.remove(id);
  }
}
