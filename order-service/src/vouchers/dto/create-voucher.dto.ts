import {
  IsInt,
  IsISO8601,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateVoucherDto {
  @IsString()
  code: string;
  @IsNumber()
  discount_percent: number;
  @IsNumber()
  discount_amount: number;
  @IsNumber()
  minimum_order: number;
  @IsISO8601()
  valid_from: Date;
  @IsISO8601()
  valid_to: Date;
  @IsOptional()
  @IsInt()
  status: number;
}
