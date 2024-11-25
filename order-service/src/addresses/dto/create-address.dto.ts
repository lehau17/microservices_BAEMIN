import { IsString, IsOptional, IsInt } from 'class-validator';

export class CreateAddressDto {
  adr_phone: string;

  adr_name: string;
  adr_address: any;
  user_id: number;
}
