import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import {
  Profile,
  Strategy,
  StrategyOptions,
  VerifyCallback,
} from 'passport-google-oauth20';
import { UserRole } from '../types';

interface ExtendedGoogleStrategyOptions extends StrategyOptions {
  accessType?: 'online' | 'offline';
  prompt?: string;
}

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    const options: ExtendedGoogleStrategyOptions = {
      clientID: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
      callbackURL: `http://localhost:${process.env.PORT}/auth/google/callback`,
      scope: ['email', 'profile'],
      accessType: 'offline',
      prompt: 'consent',
    };
    super(options);
  }
  validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): any {
    const { name, emails, photos } = profile;

    // Retorna diretamente o conteúdo que deve estar em req.userGoogle
    const userGoogle = {
      id: profile.id,
      name: `${name?.givenName.toUpperCase()} ${name?.familyName.toUpperCase()}`,
      email: emails?.[0].value,
      password: 'oauth',
      role: UserRole.USER,
      picture: photos?.[0].value,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastLogin: new Date(),
      accessToken,
    };

    // Retorne esse objeto direto
    done(null, userGoogle);
  }
}
