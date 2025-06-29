import { Request as ExpressRequest } from 'express';
import { AuthUser } from '../auth/dto';

export interface CustomRequest extends ExpressRequest {
  user: AuthUser;
}
