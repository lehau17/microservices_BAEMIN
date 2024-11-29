import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter'; // Optional nếu bạn muốn gửi email HTML bằng Handlebars
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    MailModule,
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: 'hau17131203@gmail.com',
          pass: 'quup slyz pzwp ifog',
        },
      },
      defaults: {
        from: '"No Reply" <noreply@letrunghau.com>',
      },
      template: {
        dir: __dirname + '/templates',
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
})
export class AppModule {}
