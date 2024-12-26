import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class CreateVideoDto {
  @IsString()
  @IsNotEmpty()
  title: string;
  @IsUrl()
  @IsNotEmpty()
  url: string;
  @IsEnum(['Publish', 'OnlyHaveUrl', 'Private'])
  @IsNotEmpty()
  state_video?: string;
  @IsEnum(['Allowed', 'Censor', 'Not_Allowed'])
  @IsNotEmpty()
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
