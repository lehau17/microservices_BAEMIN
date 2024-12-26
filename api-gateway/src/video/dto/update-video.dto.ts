import { PartialType } from '@nestjs/mapped-types';
import { CreateVideoDto } from './create-video.dto';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class UpdateVideoDto {
  @IsString()
  @IsOptional()
  title: string;
  @IsOptional()
  @IsUrl()
  @IsOptional()
  url: string;
  @IsEnum(['Publish', 'OnlyHaveUrl', 'Private'])
  @IsOptional()
  state_video?: string;
  @IsEnum(['Allowed', 'Censor', 'Not_Allowed'])
  @IsOptional()
  state_comment?: string;
  @IsBoolean()
  @IsOptional()
  is_publish_total_like?: boolean;
  @IsBoolean()
  @IsOptional()
  is_publish_total_share?: boolean;
  @IsBoolean()
  @IsOptional()
  is_allow_share?: boolean;
  @IsBoolean()
  @IsOptional()
  is_allow_dowload?: boolean;
}
