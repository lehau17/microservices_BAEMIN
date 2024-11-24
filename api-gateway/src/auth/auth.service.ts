import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { createHmac } from 'node:crypto';
import { LoginDto } from './dto/login.dto';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { userDto } from 'src/common/dto/user.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { handleRetryWithBackoff } from 'src/common/utils/handlerTimeoutWithBackoff';

@Injectable()
export class AuthService {
  constructor(
    @Inject('USER_SERVICE') private userService: ClientProxy,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async login(payload: LoginDto) {
    return lastValueFrom(
      this.userService
        .send('loginUser', payload)
        .pipe(handleRetryWithBackoff(3, 2000)),
    );
  }

  async validateUser(username: string, password: string) {
    return lastValueFrom(
      this.userService
        .send('validateUser', { username, password })
        .pipe(handleRetryWithBackoff(3, 1000)),
    );
  }

  async register(payload: any) {
    const value = await lastValueFrom(
      this.userService.send('registerUser', payload),
    );
    return value;
  }

  async refreshToken(payload: RefreshTokenDto): Promise<Boolean> {
    const isSuccess = await lastValueFrom(
      this.userService
        .send('refreshToken', payload)
        .pipe(handleRetryWithBackoff(3, 1000)),
    );
    return isSuccess;
  }
}
