import { PartialType } from '@nestjs/mapped-types';
import { CreateShareVideoDto } from './create-share-video.dto';

export class UpdateShareVideoDto extends PartialType(CreateShareVideoDto) {
  id: number;
}
