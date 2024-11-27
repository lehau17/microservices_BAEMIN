import { IsISO8601, IsOptional } from 'class-validator';

export class FindVoucherDto {
  @IsOptional()
  limit?: number;
  @IsOptional()
  skip?: number;
  @IsOptional()
  cursor?: number;
  @IsOptional()
  code?: string;
  @IsOptional()
  @IsISO8601()
  from?: Date;
  @IsOptional()
  @IsISO8601()
  to?: Date;
  @IsOptional()
  min_price?: number;
  @IsOptional()
  to_price?: number;
  @IsOptional()
  c_time?: number;
}
