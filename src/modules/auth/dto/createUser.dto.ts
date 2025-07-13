import { UserRole } from '@/config/types';

export class CreateUserDto {
  name!: string;
  email!: string;
  password!: string;
  role!: UserRole;
}
