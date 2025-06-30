import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Session } from '../models/session.model';

@Injectable()
export class SessionService {
  constructor(
    @InjectModel(Session)
    private sessionModel: typeof Session,
  ) {}

  async storeToken(userId: string, token: string): Promise<void> {
    await this.sessionModel.create({ userId, token });
  }

  async isTokenValid(userId: string, token: string): Promise<boolean> {
    const session = await this.sessionModel.findOne({
      where: { userId, token },
    });
    return !!session;
  }

  async invalidateUserTokens(userId: string): Promise<void> {
    await this.sessionModel.destroy({ where: { userId } });
  }

  async tokenExists(token: string): Promise<boolean> {
    const session = await this.sessionModel.findOne({ where: { token } });
    return !!session;
  }
}
