import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { StringValue } from 'ms';
import { AuthUser, DecodedToken } from '../auth/dto/authUser';

@Injectable()
export class JWT {
  public generateToken(user: AuthUser): string {
    const secret = process.env.JWT_SECRET;
    if (typeof secret !== 'string' || !secret.trim()) {
      throw new Error('JWT_SECRET não está definido ou é inválido.');
    }

    const expiresIn = (process.env.EXPIRES_IN || '1h') as StringValue;

    const options: jwt.SignOptions = {
      algorithm: 'HS256',
      expiresIn,
    };

    const token = jwt.sign(user, secret, options);
    return token;
  }

  public verifyToken(token: string): DecodedToken | null {
    try {
      if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET não definido');
      }

      const data = jwt.verify(token, process.env.JWT_SECRET) as DecodedToken;

      return data;
    } catch {
      return null;
    }
  }
}
