import { authRegister, userProfile, clear } from './global';

describe('Testing userProfileV2', () => {
  test('Testing for valid user', () => {
    clear();
    const member1 = authRegister('foo@bar.com', 'password', 'James', 'Charles');
    const member2 = authRegister('chicken@bar.com', 'goodpassword', 'Ronald', 'Mcdonald');

    expect(userProfile(member1.token, member2.authUserId)).toStrictEqual({
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
    clear();
    const member = authRegister('foo@bar.com', 'password', 'James', 'Charles');
    const invalidMember = member.authUserId + 1;
    const invalidToken = member.token + 'bruh';

    // valid token, invalid uId
    expect(userProfile(member.token, invalidMember)).toStrictEqual({ error: 'error' });

    // invalid token, valid uId
    expect(userProfile(invalidToken, member.authUserId)).toStrictEqual({ error: 'error' });
  });
});
