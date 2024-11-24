import { RpcException } from '@nestjs/microservices';

export async function handleServiceCall<T>(
  serviceCall: Promise<T>, // Hàm gọi đến service
): Promise<T> {
  try {
    const response = await serviceCall;

    // Kiểm tra lỗi từ service
    if (response && (response as any).status === 'error') {
      throw new RpcException({
        statusCode: 400,
        message: (response as any).message || 'Service error',
      });
    }

    return response;
  } catch (error) {
    console.error('Error caught in handleServiceCall:', error.message || error);

    // Chuẩn hóa lỗi để trả về
    throw error instanceof RpcException
      ? error
      : new RpcException({
          statusCode: 400,
          message: error?.message || 'Unexpected error occurred',
        });
  }
}
