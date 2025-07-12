import { UserRole } from '../../../types';

export interface AuthUser {
  id: string;
  name: string;
  role: UserRole;
}

export interface DecodedToken extends AuthUser {
  exp: number;
  iat: number;
}
