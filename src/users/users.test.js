import { authRegisterV1 } from '../auth/auth.js'
import { userProfileV1 } from './users'
import { clearV1 } from '../other/other.js'

describe('Testing userProfileV1', () => {
  test('Testing for valid user', () => {
    clearV1();
    let member1 = authRegisterV1('foo@bar.com', 'password', 'James', 'Charles');
    let member2 = authRegisterV1('chicken@bar.com', 'goodpassword', 'Ronald', 'Mcdonald');

    expect(userProfileV1(member1, member2)).toStrictEqual({
      uId: member2.uId,
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

    let invalidMember1 = member1 + 1;
    let invalidMember2 = member2 + 1;

    expect(userProfileV1(member1, invalidMember2)).toStrictEqual({ error: 'error' });
    expect(userProfileV1(invalidMember1, member2)).toStrictEqual({ error: 'error' });
  });

});
