import { UserRole } from '@/config/types';

export class UserDto {
  id!: string;
  name!: string;
  email!: string;
  role!: UserRole;
  createdAt!: Date;
  updatedAt!: Date;
  lastLogin!: Date | null;
}
