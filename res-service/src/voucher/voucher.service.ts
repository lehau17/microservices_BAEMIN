import { handleRetryWithBackoff } from 'src/common/utils/handlerTimeoutWithBackoff';
import { lastValueFrom } from 'rxjs';
import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateVoucherDto } from './dto/create-voucher.dto';
import { UpdateVoucherDto } from './dto/update-voucher.dto';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { RestaurantService } from 'src/restaurant/restaurant.service';

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
      this.voucherService.send('createVoucher', payload).pipe(),
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

  findOne(id: number) {
    return `This action returns a #${id} voucher`;
  }

  update(id: number, updateVoucherDto: UpdateVoucherDto) {
    return `This action updates a #${id} voucher`;
  }

  remove(id: number) {
    return `This action removes a #${id} voucher`;
  }
}
