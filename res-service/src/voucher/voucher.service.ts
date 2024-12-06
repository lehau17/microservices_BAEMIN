import { lastValueFrom } from 'rxjs';
import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateVoucherDto } from './dto/create-voucher.dto';
import { UpdateVoucherDto } from './dto/update-voucher.dto';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { RestaurantService } from 'src/restaurant/restaurant.service';
import { VoucherType } from 'src/common/types/voucher.type';
import { FindVoucherByShopDto } from './dto/find-voucher-by-shop.dto';
import { RemoveVoucherDto } from './dto/remove-voucher.dto';

@Injectable()
export class VoucherService {
  constructor(
    private resService: RestaurantService,
    @Inject('VOUCHER_SERVICE') private voucherService: ClientProxy,
  ) {}
  async create(payload: CreateVoucherDto) {
    // check owner
    const foundShop = await this.resService.findOne(payload.shop_id);
    if (!foundShop || foundShop.status === 0) {
      throw new RpcException({
        message: 'Shop not found',
        status: HttpStatus.BAD_REQUEST,
      });
    }
    const newVoucher = await lastValueFrom(
      this.voucherService.send('createVoucher', {
        ...payload,
        vchr_discount_type: VoucherType.SHOP,
      }),
    );
    if (!newVoucher) {
      throw new RpcException({
        message: 'error creating Voucher',
        status: HttpStatus.BAD_REQUEST,
      });
    }
    return newVoucher;
  }
  findAll() {
    return `This action returns all voucher`;
  }

  async findVoucherByShop(paging: FindVoucherByShopDto) {
    const foundShop = await this.resService.findOne(paging.shop_id);
    if (!foundShop || foundShop.status === 0) {
      throw new RpcException({
        message: 'Shop not found',
        status: HttpStatus.BAD_REQUEST,
      });
    }
    return this.voucherService.send('findVoucherByShop', paging);
  }

  findOne(id: number) {}

  async update({ shop_id, ...payload }: UpdateVoucherDto) {
    const foundShop = await this.resService.findOne(shop_id);
    if (!foundShop || foundShop.status === 0) {
      throw new RpcException({
        message: 'Shop not found',
        status: HttpStatus.BAD_REQUEST,
      });
    }
    return this.voucherService.send('updateVoucher', payload);
  }

  async remove(payload: RemoveVoucherDto) {
    const foundShop = await this.resService.findOne(payload.shop_id);
    if (!foundShop || foundShop.status === 0) {
      throw new RpcException({
        message: 'Shop not found',
        status: HttpStatus.BAD_REQUEST,
      });
    }
    return this.voucherService.send('removeVoucher', payload.id);
  }
}
