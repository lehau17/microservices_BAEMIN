import { Inject, Injectable } from '@nestjs/common';
import { CreateMailDto } from './dto/create-mail.dto';
import { UpdateMailDto } from './dto/update-mail.dto';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class MailService {
  constructor(@Inject('MAIL_SERVICE') private mailService: ClientProxy) {}

  sendMailRegisterAccountSuccess(to: string[], context: Record<string, any>) {
    this.mailService.emit('sendMail', {
      to,
      context,
      subject: 'Welcome to My E-Commerce',
      template: './welcome.hbs',
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} mail`;
  }

  update(id: number, updateMailDto: UpdateMailDto) {
    return `This action updates a #${id} mail`;
  }

  remove(id: number) {
    return `This action removes a #${id} mail`;
  }
}
