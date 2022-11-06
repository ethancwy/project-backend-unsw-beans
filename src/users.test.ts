import {
  authRegister, authLogout, userProfile, clear,
  usersAll, userSetName, userSetEmail, userSetHandle, channelsCreate, channelJoin, dmCreate,
  userStats, usersStats
} from './global';

clear();
describe('Testing userProfileV3', () => {
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

describe('Error checking userProfileV3', () => {
  test('Testing for invalid users', () => {
    clear();
    const member = authRegister('foo@bar.com', 'password', 'James', 'Charles');
    const invalidMember = member.authUserId + 1;
    const invalidToken = member.token + 'bruh';

    // valid token, invalid uId
    expect(userProfile(member.token, invalidMember)).toStrictEqual(400);

    // invalid token, valid uId
    expect(userProfile(invalidToken, member.authUserId)).toStrictEqual(403);
  });

  test('Testing invalid userProfile following a successful authLogout', () => {
    clear();
    const user = authRegister('p.file@gmail.com', 'Bob100', 'Peter', 'File');
    expect(userProfile(user.token, user.authUserId)).toStrictEqual({
      user: {
        uId: user.authUserId,
        email: 'p.file@gmail.com',
        nameFirst: 'Peter',
        nameLast: 'File',
        handleStr: expect.any(String),
      }
    });
    expect(authLogout(user.token)).toStrictEqual({});
    expect(userProfile(user.token, user.authUserId)).toStrictEqual(403);
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

    expect(usersAll(invalidToken)).toStrictEqual(403);
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

    expect(userSetName(invalidToken, 'Jamie', 'Charlie')).toStrictEqual(403);
  });

  test('Invalid nameFirst', () => {
    clear();
    const member = authRegister('foo@bar.com', 'password', 'James', 'Charles');

    expect(userSetName(member.token, '', 'Charlie')).toStrictEqual(400);
    expect(userSetName(member.token, 'dsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsd',
      'Charlie')).toStrictEqual(400);
  });

  test('Invalid nameLast', () => {
    clear();
    const member = authRegister('foo@bar.com', 'password', 'James', 'Charles');

    expect(userSetName(member.token, 'Jamie', '')).toStrictEqual(400);
    expect(userSetName(member.token, 'Jamie',
      'dsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsd')).toStrictEqual(400);
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

    expect(userSetEmail(invalidToken, 'aintnofoo@bar.com')).toStrictEqual(403);

    expect(userSetEmail(member1.token, '@bar.com')).toStrictEqual(400);
    expect(userSetEmail(member1.token, '@bar@chicken.com')).toStrictEqual(400);
    expect(userSetEmail(member1.token, 'chicken.com')).toStrictEqual(400);
    expect(userSetEmail(member1.token, 'chicken')).toStrictEqual(400);
    expect(userSetEmail(member1.token, '')).toStrictEqual(400);
  });

  test('Email already in use', () => {
    clear();
    const member1 = authRegister('foo@bar.com', 'password', 'James', 'Charles');
    authRegister('chicken@bar.com', 'goodpassword', 'Ronald', 'Mcdonald');

    expect(userSetEmail(member1.token, 'chicken@bar.com')).toStrictEqual(400);
  });
});

describe('Testing userSetHandleV1', () => {
  test('Successfully updating two handles', () => {
    clear();
    const member1 = authRegister('foo@bar.com', 'password', 'James', 'Charles');
    const member2 = authRegister('chicken@bar.com', 'goodpassword', 'Ronald', 'Mcdonald');

    expect(userSetHandle(member1.token, 'ja3')).toStrictEqual({});
    expect(userSetHandle(member2.token, 'ronalddddddddddddddd')).toStrictEqual({});
    expect(usersAll(member1.token)).toStrictEqual({
      users: [
        {
          uId: member1.authUserId,
          email: 'foo@bar.com',
          nameFirst: 'James',
          nameLast: 'Charles',
          handleStr: 'ja3',
        },
        {
          uId: member2.authUserId,
          email: 'chicken@bar.com',
          nameFirst: 'Ronald',
          nameLast: 'Mcdonald',
          handleStr: 'ronalddddddddddddddd',
        },
      ],
    });
  });
});

describe('Error checking userSetHandleV1', () => {
  test('Invalid token, length of handleStr, non-alphanumeric characters, spacings, empty strings', () => {
    clear();
    const member1 = authRegister('foo@bar.com', 'password', 'James', 'Charles');

    const invalidToken = member1.token + 'lolol';
    // invalid token
    expect(userSetHandle(invalidToken, 'jameshehe123')).toStrictEqual(403);
    // invalid length: 2 characters
    expect(userSetHandle(member1.token, 'ja')).toStrictEqual(400);
    // invalid length: 21 characters
    expect(userSetHandle(member1.token, 'jaaaaaaaaaaamesssssss')).toStrictEqual(400);
    // non-alphanumeric characters
    expect(userSetHandle(member1.token, 'james@foo')).toStrictEqual(400);
    // space in between
    expect(userSetHandle(member1.token, 'james charlesteehee')).toStrictEqual(400);
    // empty string
    expect(userSetHandle(member1.token, '')).toStrictEqual(400);
  });

  test('handleStr already in use', () => {
    clear();
    const member1 = authRegister('foo@bar.com', 'password', 'James', 'Charles');
    const member2 = authRegister('chicken@bar.com', 'goodpassword', 'Ronald', 'Mcdonald');

    // member2 trying to change handle
    // get handleStr using userProfile function
    const member1Details = userProfile(member2.token, member1.authUserId);

    expect(userSetHandle(member2.token, member1Details.user.handleStr)).toStrictEqual(400);
    clear();
  });
});

describe('Testing userStatsV1', () => {
  test('Successfully returning stats of user', () => {
    clear();
    const member1 = authRegister('foo@bar.com', 'password', 'James', 'Charles');
    const member2 = authRegister('chicken@bar.com', 'goodpassword', 'Ronald', 'Mcdonald');
    // Creating channels to test stats
    const channel1 = channelsCreate(member1.token, 'channel1', true);
    const channel2 = channelsCreate(member1.token, 'channel2', false);
    channelJoin(member2.token, channel1.channelId);
    // Creating dm to test stats
    const dm = dmCreate(member1.token, [member2.authUserId]);

    // Testing user stats of member 1
    expect(userStats(member1.token)).toStrictEqual({
      channelsJoined: [
        {numChannelsJoined: 0, timeStamp: expect.any(Number)},
        {numChannelsJoined: 1, timeStamp: expect.any(Number)},
        {numChannelsJoined: 2, timeStamp: expect.any(Number)}],
      dmsJoined: [
        {numDmsJoined: 0, timeStamp: expect.any(Number)},
        {numDmsJoined: 1, timeStamp: expect.any(Number)}],
      messagesSent: [{numMessagesSent: 0, timeStamp: expect.any(Number)}],
      involvementRate: 1,
    });

    // Testing user stats of member 2
    expect(userStats(member2.token)).toStrictEqual({
      channelsJoined: [
        {numChannelsJoined: 0, timeStamp: expect.any(Number)},
        {numChannelsJoined: 1, timeStamp: expect.any(Number)}],
      dmsJoined: [
        {numDmsJoined: 0, timeStamp: expect.any(Number)},
        {numDmsJoined: 1, timeStamp: expect.any(Number)}],
      messagesSent: [{numMessagesSent: 0, timeStamp: expect.any(Number)}],
      involvementRate: 2 / 3,
    });
    
  });
});

describe('Error checking userStatsV1', () => {
  test('Invalid token', () => {
    clear();
    const member1 = authRegister('foo@bar.com', 'password', 'James', 'Charles');

    const invalidToken = member1.token + 'lolol';
    // invalid token
    expect(userStats(invalidToken)).toStrictEqual(403);
  });
});

describe('Testing usersStatsV1', () => {
  test('Successfully returning stats of workspace', () => {
    clear();
    const member1 = authRegister('foo@bar.com', 'password', 'James', 'Charles');
    const member2 = authRegister('chicken@bar.com', 'goodpassword', 'Ronald', 'Mcdonald');
    // Creating channels to test stats
    channelsCreate(member1.token, 'channel1', true);
    channelsCreate(member1.token, 'channel2', false);
    // Creating dm to test stats
    const dm = dmCreate(member1.token, [member2.authUserId]);

    // Testing user stats of member 1
    expect(usersStats(member1.token)).toStrictEqual({
      channelsExist: [
        {numChannelsExist: 0, timeStamp: expect.any(Number)},
        {numChannelsExist: 1, timeStamp: expect.any(Number)},
        {numChannelsExist: 2, timeStamp: expect.any(Number)}],
      dmsExist: [
        {numDmsExist: 0, timeStamp: expect.any(Number)},
        {numDmsExist: 1, timeStamp: expect.any(Number)}],
      messagesExist: [{numMessagesExist: 0, timeStamp: expect.any(Number)}],
      utilizationRate: 1,
    });
  });
});

describe('Error checking usersStatsV1', () => {
  test('Invalid token', () => {
    clear();
    const member1 = authRegister('foo@bar.com', 'password', 'James', 'Charles');

    const invalidToken = member1.token + 'lolol';
    // invalid token
    expect(userStats(invalidToken)).toStrictEqual(403);
  });
});

