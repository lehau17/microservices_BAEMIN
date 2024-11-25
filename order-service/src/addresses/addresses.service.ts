import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@Injectable()
export class AddressesService {
  constructor(private prisma: PrismaService) {}

  async getAddressesByUserId(userId: number) {
    return this.prisma.addresses.findMany({
      where: { user_id: userId },
    });
  }

  async create(data: CreateAddressDto) {
    return this.prisma.addresses.create({
      data,
    });
  }

  async updateAddress(data: UpdateAddressDto) {
    return this.prisma.addresses.update({
      where: { id: data.id },
      data,
    });
  }

  async deleteAddress(id: number) {
    return this.prisma.addresses.delete({
      where: { id },
    });
  }
}
