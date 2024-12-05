import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { VoucherUsageService } from './voucher-usage.service';
import { CreateVoucherUsageDto } from './dto/create-voucher-usage.dto';
import { UpdateVoucherUsageDto } from './dto/update-voucher-usage.dto';

@Controller()
export class VoucherUsageController {
  constructor(private readonly voucherUsageService: VoucherUsageService) {}

  @MessagePattern('createVoucherUsage')
  create(@Payload() createVoucherUsageDto: any) {
    return this.voucherUsageService.create(createVoucherUsageDto);
  }

  @MessagePattern('findAllVoucherUsage')
  findAll() {
    return this.voucherUsageService.findAll();
  }

  @MessagePattern('findOneVoucherUsage')
  findOne(@Payload() id: number) {
    return this.voucherUsageService.findOne(id);
  }

  @MessagePattern('updateVoucherUsage')
  update(@Payload() updateVoucherUsageDto: any) {
    return this.voucherUsageService.update(
      updateVoucherUsageDto.id,
      updateVoucherUsageDto,
    );
  }

  @MessagePattern('removeVoucherUsage')
  remove(@Payload() id: number) {
    return this.voucherUsageService.remove(id);
  }
}
