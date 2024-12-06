import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { VoucherUsageService } from './voucher-usage.service';
import { CreateVoucherUsageDto } from './dto/create-voucher-usage.dto';
import { UpdateVoucherUsageDto } from './dto/update-voucher-usage.dto';

@Controller('voucher-usage')
export class VoucherUsageController {
  constructor(private readonly voucherUsageService: VoucherUsageService) {}

  @Post()
  create(@Body() createVoucherUsageDto: CreateVoucherUsageDto) {
    return this.voucherUsageService.create(createVoucherUsageDto);
  }

  @Get()
  findAll() {
    return this.voucherUsageService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.voucherUsageService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateVoucherUsageDto: UpdateVoucherUsageDto,
  ) {
    return this.voucherUsageService.update(+id, updateVoucherUsageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.voucherUsageService.remove(+id);
  }
}
