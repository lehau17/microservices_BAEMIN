import { IsISO8601, IsOptional } from 'class-validator';

export class FindVoucherDto {
  limit?: number;
  skip?: number;
  cursor?: number;
  code?: string;
  from?: Date;
  to?: Date;
  to_price?: number;
  c_time?: number;
}
