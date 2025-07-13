import { randomUUID } from 'crypto';
import { User } from '../models/user.model';
import { UserRole } from '../types';

export class UserMock {
  public static build(params?: Partial<User>) {
    return {
      id: params?.id || randomUUID(),
      name: params?.name || 'any_name',
      email: params?.email || 'any_email',
      password: params?.password || 'any_password',
      role: params?.role || UserRole.USER,
      createdAt: params?.createdAt || new Date(),
      updatedAt: params?.updatedAt || new Date(),
      lastLogin: params?.lastLogin ?? null,
    };
  }
}
