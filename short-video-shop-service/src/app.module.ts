import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VideoModule } from './video/video.module';
import { PrismaModule } from './prisma/prima.module';

@Module({
  imports: [VideoModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
