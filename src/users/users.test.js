import { authRegisterV1 } from '../auth/auth.js'
import { userProfileV1 } from './users'
import { clearV1 } from '../other/other.js'

describe('Testing userProfileV1', () => {
  test('Testing for valid user', () => {
    clearV1();
    let member1 = authRegisterV1('foo@bar.com', 'password', 'James', 'Charles');
    let member2 = authRegisterV1('chicken@bar.com', 'goodpassword', 'Ronald', 'Mcdonald');

    expect(userProfileV1(member1.authUserId, member2.authUserId)).toStrictEqual({
      uId: member2.authUserId,
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
    let member1 = authRegisterV1('foo@bar.com', 'password', 'James', 'Charles');
    let member2 = authRegisterV1('chicken@bar.com', 'goodpassword', 'Ronald', 'Mcdonald');

    let invalidMember = member1.authUserId + member2.authUserId;

    expect(userProfileV1(member1.authUserId, invalidMember)).toStrictEqual({ error: 'invalid uId' });
    expect(userProfileV1(invalidMember, member2.authUserId)).toStrictEqual({ error: 'invalid authUserId' });
  });

});