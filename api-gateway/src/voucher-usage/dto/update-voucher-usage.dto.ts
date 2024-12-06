import { PartialType } from '@nestjs/mapped-types';
import { CreateVoucherUsageDto } from './create-voucher-usage.dto';

export class UpdateVoucherUsageDto extends PartialType(CreateVoucherUsageDto) {}
