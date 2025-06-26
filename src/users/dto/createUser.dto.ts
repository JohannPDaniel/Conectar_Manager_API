import { UserRole } from '../../types/userRoles';

export class CreateUserDto {
  name!: string;
  email!: string;
  password!: string;
  role!: UserRole;
}
