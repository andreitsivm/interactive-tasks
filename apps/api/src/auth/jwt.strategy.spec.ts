import { JwtStrategy } from './jwt.strategy';
import type { IJwtPayload, UserRole, Permission } from '@workspace/types';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;

  beforeEach(() => {
    process.env.AUTH_SECRET = 'test-secret-that-is-32-chars-long!!';
    strategy = new JwtStrategy();
  });

  it('returns the payload unchanged from validate()', () => {
    const payload: IJwtPayload = {
      sub: 'user-1',
      email: 'test@example.com',
      roles: ['member' as UserRole],
      permissions: ['read:tasks' as Permission],
    };
    expect(strategy.validate(payload)).toEqual(payload);
  });
});
