import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsObject,
  IsISO8601,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateRestaurantDto {
  @IsString()
  @IsNotEmpty()
  res_name: string;

  @IsISO8601() // Validate định dạng thời gian ISO8601
  @IsNotEmpty()
  res_time_start: string;

  @IsObject()
  @IsNotEmpty()
  @IsObject()
  res_address: any;

  @IsISO8601()
  @IsNotEmpty()
  res_time_end: string;
}
