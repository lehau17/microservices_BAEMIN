import { Body, Controller, Headers, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenTokenGuard } from 'src/common/guards/refreshToken.guard';

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() payload: LoginDto) {
    return this.authService.login(payload);
  }

  @Post('register')
  async register(@Body() payload: any) {
    const data = await this.authService.register(payload);
    return data;
  }

  @Post('refresh-token')
  @UseGuards(RefreshTokenTokenGuard)
  async refreshToken(@Headers('x-refresh-token') refreshToken: string) {
    return refreshToken;
  }
}
