import { PrismaService } from './../../voucher-service/src/prisma/prisma.service';
import { PrismaModule } from './../../voucher-service/src/prisma/prima.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ShareVideoModule } from './share-video/share-video.module';

@Module({
  imports: [PrismaModule, ShareVideoModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
