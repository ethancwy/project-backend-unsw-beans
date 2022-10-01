import { authRegisterV1 } from '../auth/auth.js'
import { userProfileV1 } from './users'
import { clearV1 } from '../other/other.js'

describe('Testing userProfileV1', () => {
  test('Testing for valid user', () => {
    clearV1();
    let authUserId = authRegisterV1('foo@bar.com', 'password', 'James', 'Charles');
    let user = authRegisterV1('chicken@bar.com', 'goodpassword', 'Ronald', 'Mcdonald');

    expect(userProfileV1(authUserId, user)).toStrictEqual({
      uId: expect.any(Number),
      email: 'chicken@bar.com',
      nameFirst: 'Ronald',
      nameLast: 'Mcdonald',
      handleStr: expect.any(String),
    });
  });
});

describe('Error checking userProfileV1', () => {
  test('Testing for invalid users', () => {
    clearV1();
    let authUserId = authRegisterV1('foo@bar.com', 'password', 'James', 'Charles');
    let user = authRegisterV1('chicken@bar.com', 'goodpassword', 'Ronald', 'Mcdonald');

    // using string 'eee' as invalid id's
    expect(userProfileV1(authUserId, 'eee')).toStrictEqual({ error: 'error' });
    expect(userProfileV1('eee', user)).toStrictEqual({ error: 'error' });
  });

});
