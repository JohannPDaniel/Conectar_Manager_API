import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class Bcrypt {
  async generateHash(password: string): Promise<string> {
    const salt = Number(process.env.BCRYPT_SALT) || 10;
    return bcrypt.hash(password, salt);
  }

  async verify(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
