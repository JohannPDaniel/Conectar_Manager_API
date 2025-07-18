import { UserRole } from './userRoles';

export interface AuthUserGoogle {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  lastLogin: Date;
  accessToken: string;
}
