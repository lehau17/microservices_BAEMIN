import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AddressesService } from './addresses.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@Controller()
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @MessagePattern('createAddress')
  create(@Payload() createAddressDto: CreateAddressDto) {
    return this.addressesService.create(createAddressDto);
  }

  @MessagePattern('findAllAddresses')
  findAll(@Payload() user_id: number) {
    return this.addressesService.getAddressesByUserId(user_id);
  }

  @MessagePattern('updateAddress')
  update(@Payload() updateAddressDto: UpdateAddressDto) {
    return this.addressesService.updateAddress(updateAddressDto);
  }

  @MessagePattern('removeAddress')
  remove(@Payload() id: number) {
    return this.addressesService.deleteAddress(id);
  }
}
