import { Request as ExpressRequest } from 'express';
import { AuthUser } from '../../modules/auth/dto';
import { AuthUserGoogle } from './authUserGoogle';

export interface CustomRequest extends ExpressRequest {
  user: AuthUser;
  userGoogle: AuthUserGoogle;
}
