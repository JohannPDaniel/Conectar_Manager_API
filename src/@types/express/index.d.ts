import { AuthUser } from '../../auth/dto/authUser';

export declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}
