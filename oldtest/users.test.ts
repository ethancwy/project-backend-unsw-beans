import { authRegisterV2 } from './auth';
import { userProfileV2 } from './users';
import { clearV1 } from './other';

describe('Testing userProfileV2', () => {
  test('Testing for valid user', () => {
    clearV1();
    const member1 = authRegisterV2('foo@bar.com', 'password', 'James', 'Charles');
    const member2 = authRegisterV2('chicken@bar.com', 'goodpassword', 'Ronald', 'Mcdonald');

    expect(userProfileV2(member1.authUserId, member2.authUserId)).toStrictEqual({
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

describe('Error checking userProfileV2', () => {
  test('Testing for invalid users', () => {
    clearV1();
    const member = authRegisterV2('foo@bar.com', 'password', 'James', 'Charles');
    const invalidMember = member.authUserId + 1;

    // valid authUserId, invalid uId
    expect(userProfileV2(member.authUserId, invalidMember)).toStrictEqual({ error: 'error' });

    // invalid authUserId, valid uId
    expect(userProfileV2(invalidMember, member.authUserId)).toStrictEqual({ error: 'error' });
  });
});