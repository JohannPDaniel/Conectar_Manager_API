import { UserRole } from '@/config/types';
import { IsEmail, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  name!: string;

  @IsEmail()
  email!: string;

  @IsString()
  password!: string;

  @IsString()
  role!: UserRole;

  @IsString()
  refreshToken?: string;
}
