import { Module } from '@nestjs/common';
import { ShareVideoService } from './share-video.service';
import { ShareVideoController } from './share-video.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [ShareVideoController],
  providers: [ShareVideoService, PrismaService],
})
export class ShareVideoModule {}
