import { IsOptional } from 'class-validator';

export class PagingDto {
  @IsOptional()
  limit?: number;
  @IsOptional()
  skip?: number;
  @IsOptional()
  cursor?: number;
}

export class PagingDtoV2 {
  @IsOptional()
  limit?: number;
  @IsOptional()
  page?: number;
  @IsOptional()
  cursor?: number;
}
