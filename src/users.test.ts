import { authRegisterV1 } from './auth';
import { userProfileV1 } from './users';
import { clearV1 } from './other';

describe('Testing userProfileV1', () => {
  test('Testing for valid user', () => {
    clearV1();
    const member1 = authRegisterV1('foo@bar.com', 'password', 'James', 'Charles');
    const member2 = authRegisterV1('chicken@bar.com', 'goodpassword', 'Ronald', 'Mcdonald');

    expect(userProfileV1(member1.authUserId, member2.authUserId)).toStrictEqual({
      user: {
        uId: member2.authUserId,
        email: 'chicken@bar.com',
        nameFirst: 'Ronald',
        nameLast: 'Mcdonald',
        handleStr: expect.any(String),
      }
    });
  });
});

describe('Error checking userProfileV1', () => {
  test('Testing for invalid users', () => {
    clearV1();
    const member = authRegisterV1('foo@bar.com', 'password', 'James', 'Charles');
    const invalidMember = member.authUserId + 1;

    // valid authUserId, invalid uId
    expect(userProfileV1(member.authUserId, invalidMember)).toStrictEqual({ error: 'error' });

    // invalid authUserId, valid uId
    expect(userProfileV1(invalidMember, member.authUserId)).toStrictEqual({ error: 'error' });
  });
});
