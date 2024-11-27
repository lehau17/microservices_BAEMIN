import { IsString, IsOptional, IsInt } from 'class-validator';

export class CreateAddressDto {
  @IsString()
  adr_phone: string;

  @IsString()
  adr_name: string;

  @IsString()
  adr_address: string;
}
