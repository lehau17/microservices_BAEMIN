import { Catch, ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

@Catch()
export class GlobalException implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    console.error('Exception caught:', exception);

    const ctx = host.switchToRpc();
    const response = ctx.getContext();

    const errorResponse = {
      message: exception.message || 'Internal error',
      statusCode: exception.statusCode || 500,
    };
    0;
    return new RpcException(errorResponse);
  }
}
