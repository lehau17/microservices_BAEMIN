import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Controller()
export class AppController {
  constructor(@Inject("USER_SERVICE") private userService : ClientProxy) {}

  @Get("healcheck/user")
  async getHello() {
    const result = await lastValueFrom(this.userService.send("healcheck", "data"))
    return result
  }


}
