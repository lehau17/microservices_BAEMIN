import { IsString } from 'class-validator';

export class LoginDto {
  @IsString()
  usr_username: string;
  @IsString()
  usr_password: string;
}
