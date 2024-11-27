import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { RpcException } from '@nestjs/microservices';

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

  async findOne(id: number) {
    return this.prisma.addresses.findFirst({ where: { id } });
  }

  async updateAddress(data: UpdateAddressDto) {
    const foundAddress = await this.findOne(data.id);
    if (!foundAddress)
      throw new RpcException({ message: 'Address not found', statusCode: 400 });
    if (foundAddress.user_id !== data.user_id) {
      throw new RpcException({ message: 'Forbidden', statusCode: 403 });
    }
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
