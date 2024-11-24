import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

@Catch()
export class UserServiceExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToRpc();

    let errorResponse = {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal Server Error',
    };

    if (exception instanceof RpcException) {
      const error = exception.getError() as any;
      errorResponse =
        typeof error === 'string' ? { statusCode: 400, message: error } : error;
    }

    throw new RpcException(errorResponse);
  }
}
