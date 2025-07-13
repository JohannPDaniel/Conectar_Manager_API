import { JWT } from '../src/config/utils';
import { AuthUser } from '../src/modules/auth/dto';

export function makeToken(payload: AuthUser) {
  const jwt = new JWT();

  const token = jwt.generateToken(payload);

  return token;
}
