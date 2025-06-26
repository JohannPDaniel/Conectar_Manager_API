import { Injectable } from '@nestjs/common';
import { User } from '../../users/user.model';
import { Bcrypt } from '../../utils/bcrypt';
import { JWT } from '../../utils/jwt';
import { AuthUser } from '../dto/authUser';
import { LoginDto } from '../dto/loginDto';

@Injectable()
export class AuthService {
  constructor(
    private readonly bcrypt: Bcrypt,
    private readonly jwt: JWT,
  ) {}
  public async login(data: LoginDto) {
    const user = await User.findOne({ where: { email: data.email } });

    if (!user) {
      return {
        success: false,
        code: 404,
        message: 'E-mail ou senha incorretos!',
      };
    }

    const hash = user.password;
    const isValidPassword = await this.bcrypt.verify(data.password, hash);

    if (!isValidPassword) {
      return {
        success: false,
        code: 404,
        message: 'E-mail ou senha inválidos!',
      };
    }

    const payload: AuthUser = {
      id: user.id,
      name: user.name,
      role: user.role,
    };

    const token = this.jwt.generateToken(payload);

    return {
      success: true,
      code: 200,
      message: 'Login efetuado com sucesso !!!',
      data: { token: token },
    };
  }
}
