import { createUserMiddleware } from './createUser.middleware';

describe('UsersMiddleware', () => {
  it('should be defined', () => {
    expect(new createUserMiddleware()).toBeDefined();
  });
});
