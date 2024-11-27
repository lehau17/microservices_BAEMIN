import { Inject, Injectable } from '@nestjs/common';
import { CreateVoucherDto } from './dto/create-voucher.dto';
import { UpdateVoucherDto } from './dto/update-voucher.dto';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { handleRetryWithBackoff } from 'src/common/utils/handlerTimeoutWithBackoff';
import { PagingDto } from 'src/common/dto/paging.dto';
import { FindVoucherDto } from './dto/find-vopucher.dto';

@Injectable()
export class VouchersService {
  constructor(@Inject('ORDER_SERVICE') private orderService: ClientProxy) {}
  create(createVoucherDto: CreateVoucherDto) {
    return lastValueFrom(
      this.orderService
        .send('createVoucher', createVoucherDto)
        .pipe(handleRetryWithBackoff(3, 1000)),
    );
  }

  findAll(paging: FindVoucherDto) {
    return lastValueFrom(
      this.orderService
        .send('findAllVouchers', paging)
        .pipe(handleRetryWithBackoff(3, 1000)),
    );
  }

  findOne(id: number) {
    return lastValueFrom(
      this.orderService
        .send('findOneVoucher', id)
        .pipe(handleRetryWithBackoff(3, 1000)),
    );
  }

  update(id: number, updateVoucherDto: UpdateVoucherDto) {
    return lastValueFrom(
      this.orderService
        .send('updateVoucher', { id, ...updateVoucherDto })
        .pipe(handleRetryWithBackoff(3, 1000)),
    );
  }

  remove(id: number) {
    return lastValueFrom(
      this.orderService
        .send('removeVoucher', id)
        .pipe(handleRetryWithBackoff(3, 1000)),
    );
  }
}
