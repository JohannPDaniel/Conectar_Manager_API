import { AuthUser } from '../src/modules/auth/dto';
import { JWT } from '../src/utils';

export function makeToken(payload: AuthUser) {
  const jwt = new JWT();

  const token = jwt.generateToken(payload);

  return token;
}
