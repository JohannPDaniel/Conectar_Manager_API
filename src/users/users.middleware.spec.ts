import { createUserMiddleware } from './middlewares/createUser.middleware';

describe('UsersMiddleware', () => {
  it('should be defined', () => {
    expect(new createUserMiddleware()).toBeDefined();
  });
});
