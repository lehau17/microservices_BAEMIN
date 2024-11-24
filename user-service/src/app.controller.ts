import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern("healcheck")
  healcheck(@Payload() data) {
    console.log("check data", data)
    setTimeout(() => {
      console.log("time out")
    }, 2000)
    return "healcheck:oke"
  }


    @MessagePattern("login")
  login(@Payload() data) {
    return data
  }
}
