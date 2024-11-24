import { Catch, RpcExceptionFilter } from '@nestjs/common';
import { ClientProxyFactory, RpcException } from '@nestjs/microservices';
import { Observable, throwError, timestamp } from 'rxjs';

@Catch(RpcException)
export class MicroServiceExceptionFilter
  implements RpcExceptionFilter<RpcException>
{
  catch(exception: RpcException): Observable<any> {
    const micro_service_Response = exception.getError();
    return throwError(() => msCustomError(micro_service_Response, exception));
  }
}

function msCustomError(error: any, exception: any): any {
  const timestamp = new Date();
  const errorRes: any = {
    statusCode: error.statusCode,
    message: error.message,
    timestamp,
    log: exception,
  };
  console.log('check loi service', errorRes);
  return errorRes;
}
