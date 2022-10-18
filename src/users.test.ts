import {
  authRegister, userProfile, clear, usersAll, userSetName,
  userSetEmail
} from './global';

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

describe('Testing usersAllV1', () => {
  test('Returns list of all users and their details', () => {
    clear();
    const member1 = authRegister('foo@bar.com', 'password', 'James', 'Charles');
    const member2 = authRegister('chicken@bar.com', 'goodpassword', 'Ronald', 'Mcdonald');

    expect(usersAll(member1.token)).toStrictEqual({
      users: [
        {
          uId: member1.authUserId,
          email: 'foo@bar.com',
          nameFirst: 'James',
          nameLast: 'Charles',
          handleStr: expect.any(String),
        },
        {
          uId: member2.authUserId,
          email: 'chicken@bar.com',
          nameFirst: 'Ronald',
          nameLast: 'Mcdonald',
          handleStr: expect.any(String),
        },
      ],
    });
  });
});

describe('Error checking usersAllV1', () => {
  test('Invalid token', () => {
    clear();
    const member = authRegister('foo@bar.com', 'password', 'James', 'Charles');
    const invalidToken = member.token + 'lolol';

    expect(usersAll(invalidToken)).toStrictEqual({ error: 'error' });
  });
});

describe('Testing userSetNameV1', () => {
  test('Succesfully setting nameFirst and nameLast', () => {
    clear();
    const member = authRegister('foo@bar.com', 'password', 'James', 'Charles');

    expect(userSetName(member.token, 'Jamie', 'Charlie')).toStrictEqual({});
    expect(userProfile(member.token, member.authUserId)).toStrictEqual({
      user: {
        uId: member.authUserId,
        email: 'foo@bar.com',
        nameFirst: 'Jamie',
        nameLast: 'Charlie',
        handleStr: expect.any(String),
      }
    });
  });

  test('Succesfully setting nameFirst, not changing nameLast', () => {
    clear();
    const member = authRegister('foo@bar.com', 'password', 'James', 'Charles');

    expect(userSetName(member.token, 'Jamie', 'Charles')).toStrictEqual({});
    expect(userProfile(member.token, member.authUserId)).toStrictEqual({
      user: {
        uId: member.authUserId,
        email: 'foo@bar.com',
        nameFirst: 'Jamie',
        nameLast: 'Charles',
        handleStr: expect.any(String),
      }
    });
  });

  test('Succesfully setting nameLast, not changing nameFirst', () => {
    clear();
    const member = authRegister('foo@bar.com', 'password', 'James', 'Charles');
    expect(userSetName(member.token, 'James', 'Charlie')).toStrictEqual({});
    expect(userProfile(member.token, member.authUserId)).toStrictEqual({
      user: {
        uId: member.authUserId,
        email: 'foo@bar.com',
        nameFirst: 'James',
        nameLast: 'Charlie',
        handleStr: expect.any(String),
      }
    });
  });

  test('1 letter name', () => {
    clear();
    const member = authRegister('foo@bar.com', 'password', 'James', 'Charles');
    expect(userSetName(member.token, 'h', 'i')).toStrictEqual({});
    expect(userProfile(member.token, member.authUserId)).toStrictEqual({
      user: {
        uId: member.authUserId,
        email: 'foo@bar.com',
        nameFirst: 'h',
        nameLast: 'i',
        handleStr: expect.any(String),
      }
    });
  });

  test('51 letters name', () => {
    clear();
    const member = authRegister('foo@bar.com', 'password', 'James', 'Charles');
    expect(userSetName(member.token, 'dsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsds',
      'blalalallalalalalallalalalallalalalallalalalalalal')).toStrictEqual({});
    expect(userProfile(member.token, member.authUserId)).toStrictEqual({
      user: {
        uId: member.authUserId,
        email: 'foo@bar.com',
        nameFirst: 'dsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsds',
        nameLast: 'blalalallalalalalallalalalallalalalallalalalalalal',
        handleStr: expect.any(String),
      }
    });
  });
});

describe('Error checking userSetNameV1', () => {
  test('Invalid token', () => {
    clear();
    const member = authRegister('foo@bar.com', 'password', 'James', 'Charles');
    const invalidToken = member.token + 'lolol';

    expect(userSetName(invalidToken, 'Jamie', 'Charlie')).toStrictEqual({ error: 'error' });
  });

  test('Invalid nameFirst', () => {
    clear();
    const member = authRegister('foo@bar.com', 'password', 'James', 'Charles');

    expect(userSetName(member.token, '', 'Charlie')).toStrictEqual({ error: 'error' });
    expect(userSetName(member.token, 'dsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsd',
      'Charlie')).toStrictEqual({ error: 'error' });
  });

  test('Invalid nameLast', () => {
    clear();
    const member = authRegister('foo@bar.com', 'password', 'James', 'Charles');

    expect(userSetName(member.token, 'Jamie', '')).toStrictEqual({ error: 'error' });
    expect(userSetName(member.token, 'Jamie',
      'dsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsd')).toStrictEqual({ error: 'error' });
  });
});

describe('Testing userSetEmailV1', () => {
  test('Successfully updating two emails', () => {
    clear();
    const member1 = authRegister('foo@bar.com', 'password', 'James', 'Charles');
    const member2 = authRegister('chicken@bar.com', 'goodpassword', 'Ronald', 'Mcdonald');

    expect(userSetEmail(member1.token, 'aintnofoo@bar.com')).toStrictEqual({});
    expect(userSetEmail(member2.token, 'fish@bar.com')).toStrictEqual({});
    expect(usersAll(member1.token)).toStrictEqual({
      users: [
        {
          uId: member1.authUserId,
          email: 'aintnofoo@bar.com',
          nameFirst: 'James',
          nameLast: 'Charles',
          handleStr: expect.any(String),
        },
        {
          uId: member2.authUserId,
          email: 'fish@bar.com',
          nameFirst: 'Ronald',
          nameLast: 'Mcdonald',
          handleStr: expect.any(String),
        },
      ],
    });
  });
});

describe('Error checking userSetEmailV1', () => {
  test('Invalid token and emails', () => {
    clear();
    const member1 = authRegister('foo@bar.com', 'password', 'James', 'Charles');

    const invalidToken = member1.token + 'lolol';

    expect(userSetEmail(invalidToken, 'aintnofoo@bar.com')).toStrictEqual({ error: 'error' });

    expect(userSetEmail(member1.token, '@bar.com')).toStrictEqual({ error: 'error' });
    expect(userSetEmail(member1.token, '@bar@chicken.com')).toStrictEqual({ error: 'error' });
    expect(userSetEmail(member1.token, 'chicken.com')).toStrictEqual({ error: 'error' });
    expect(userSetEmail(member1.token, 'chicken')).toStrictEqual({ error: 'error' });
    expect(userSetEmail(member1.token, '')).toStrictEqual({ error: 'error' });
  });

  test('Email already in use', () => {
    clear();
    const member1 = authRegister('foo@bar.com', 'password', 'James', 'Charles');
    authRegister('chicken@bar.com', 'goodpassword', 'Ronald', 'Mcdonald');

    expect(userSetEmail(member1.token, 'chicken@bar.com')).toStrictEqual({ error: 'error' });
  });
});
