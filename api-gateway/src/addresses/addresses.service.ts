import { Inject, Injectable } from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { handleRetryWithBackoff } from 'src/common/utils/handlerTimeoutWithBackoff';

@Injectable()
export class AddressesService {
  constructor(@Inject('ORDER_SERVICE') private orderService: ClientProxy) {}

  create(createAddressDto: CreateAddressDto, user_id: number) {
    return lastValueFrom(
      this.orderService
        .send('createAddress', {
          ...createAddressDto,
          user_id: user_id,
        })
        .pipe(handleRetryWithBackoff(3, 2000)),
    );
  }

  findAll(user_id: number) {
    return lastValueFrom(
      this.orderService
        .send('findAllAddresses', user_id)
        .pipe(handleRetryWithBackoff(3, 2000)),
    );
  }

  findOne(id: number) {
    return lastValueFrom(
      this.orderService
        .send('findAddress', id)
        .pipe(handleRetryWithBackoff(3, 2000)),
    );
  }

  update(id: number, updateAddressDto: UpdateAddressDto) {
    return lastValueFrom(
      this.orderService
        .send('updateAddress', { id, ...updateAddressDto })
        .pipe(handleRetryWithBackoff(3, 2000)),
    );
  }

  remove(id: number) {
    return lastValueFrom(
      this.orderService
        .send('removeAddress', id)
        .pipe(handleRetryWithBackoff(3, 2000)),
    );
  }
}
