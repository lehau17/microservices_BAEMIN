import { IsOptional } from 'class-validator';

export class PagingDto {
  @IsOptional()
  limit?: number;
  @IsOptional()
  skip?: number;
  @IsOptional()
  cursor?: number;
}
