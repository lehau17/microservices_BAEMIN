import { Inject, Injectable } from '@nestjs/common';
import { CreateVoucherDto } from './dto/create-voucher.dto';
import { UpdateVoucherDto } from './dto/update-voucher.dto';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { handleRetryWithBackoff } from 'src/common/utils/handlerTimeoutWithBackoff';
import { FindVoucherDto } from './dto/find-vopucher.dto';
import { FindVoucherByShopDto } from './dto/find-voucher-by-shop.dto';

@Injectable()
export class VouchersService {
  constructor(@Inject('RESTAURANT_SERVICE') private resService: ClientProxy) {}
  create(createVoucherDto: CreateVoucherDto, shop_id: number) {
    return lastValueFrom(
      this.resService
        .send('createVoucher', { ...createVoucherDto, shop_id })
        .pipe(handleRetryWithBackoff(3, 1000)),
    );
  }

  listVoucherByShop(paging: FindVoucherByShopDto) {
    return lastValueFrom(
      this.resService
        .send('findVoucherByShop', paging)
        .pipe(handleRetryWithBackoff(3, 1000)),
    );
  }

  findAll(paging: FindVoucherDto) {
    return lastValueFrom(
      this.resService
        .send('findAllVouchers', paging)
        .pipe(handleRetryWithBackoff(3, 1000)),
    );
  }

  findOne(id: number) {
    return lastValueFrom(
      this.resService
        .send('findOneVoucher', id)
        .pipe(handleRetryWithBackoff(3, 1000)),
    );
  }

  update(id: number, updateVoucherDto: UpdateVoucherDto) {
    return lastValueFrom(
      this.resService
        .send('updateVoucher', { id, ...updateVoucherDto })
        .pipe(handleRetryWithBackoff(3, 1000)),
    );
  }

  remove(id: number) {
    return lastValueFrom(
      this.resService
        .send('removeVoucher', id)
        .pipe(handleRetryWithBackoff(3, 1000)),
    );
  }
}
