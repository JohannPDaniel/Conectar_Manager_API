import { LoginMiddleware } from './login.middleware';

describe('AuthMiddleware', () => {
  it('should be defined', () => {
    expect(new LoginMiddleware()).toBeDefined();
  });
});
