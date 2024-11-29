import { IsInt, Max, Min } from 'class-validator';

export class ChangeStateOrderDto {
  @IsInt()
  @Min(0)
  @Max(10)
  status: number;
}
