import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import {
  Strategy as GoogleStrategyBase,
  Profile,
  VerifyCallback,
} from 'passport-google-oauth20';
import { UserRole } from '../types';

@Injectable()
export class GoogleStrategy extends PassportStrategy(
  GoogleStrategyBase,
  'google',
) {
  constructor() {
    const options = {
      clientID: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
      callbackURL: `http://localhost:${process.env.PORT}/auth/google/callback`,
      scope: ['email', 'profile'], // <--- aqui!
      accessType: 'offline',
      prompt: 'consent',
    };

    super(options as any);
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
      name: `${name?.givenName} ${name?.familyName}`,
      email: emails?.[0]?.value ?? '',
      picture: photos?.[0]?.value ?? '',
      password: 'oauth',
      role: UserRole.USER,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastLogin: new Date(),
      accessToken,
    };

    return done(null, userGoogle);
  }
}
