import {
  authRegister, channelsCreate, channelDetails,
  channelJoin, channelInvite, clear
} from './global'

describe('Testing that channelDetailsV1 works standard', () => {
  test('when given id, returns relevant info of channels if the user is apart of it', () => {
    clearV1();

    authRegisterV1('foo@bar.com', 'password', 'James', 'Charles');
    const channelOwnerId = authRegisterV1('chocolate@bar.com', 'g00dpassword', 'Willy', 'Wonka');
    const channelIdPublic = channelsCreateV1(channelOwnerId.authUserId, 'Boost', true);

    expect(channelDetailsV1(channelOwnerId.authUserId, channelIdPublic.channelId)).toEqual(
      {
        name: 'Boost',
        isPublic: true,
        ownerMembers: [
          {
            uId: channelOwnerId.authUserId,
            email: 'chocolate@bar.com',
            nameFirst: 'Willy',
            nameLast: 'Wonka',
            handleStr: expect.any(String),
          },
        ],
        allMembers: [
          {
            uId: channelOwnerId.authUserId,
            email: 'chocolate@bar.com',
            nameFirst: 'Willy',
            nameLast: 'Wonka',
            handleStr: expect.any(String),
          },
        ],
      }
    );
  });

  test('works with priv channel and member even if there are multiple channels', () => {
    clearV1();

    authRegisterV1('foo@bar.com', 'password', 'James', 'Charles');
    const channelOwnerPrivId = authRegisterV1('pollos@hhm.com', 'g00dpassword54', 'Gus', 'Fring');
    const channelIdPriv = channelsCreateV1(channelOwnerPrivId.authUserId, 'Priv', false);

    expect(channelDetailsV1(channelOwnerPrivId.authUserId, channelIdPriv.channelId)).toEqual(
      {
        name: 'Priv',
        isPublic: false,
        ownerMembers: [
          {
            uId: channelOwnerPrivId.authUserId,
            email: 'pollos@hhm.com',
            nameFirst: 'Gus',
            nameLast: 'Fring',
            handleStr: expect.any(String),
          }
        ],
        allMembers: [
          {
            uId: channelOwnerPrivId.authUserId,
            email: 'pollos@hhm.com',
            nameFirst: 'Gus',
            nameLast: 'Fring',
            handleStr: expect.any(String),
          }
        ],
      }
    );
  });
});

describe('Testing channelDetailsV1 edge cases', () => {
  test('Testing when channelId does not refer to a valid channel', () => {
    clearV1();

    authRegisterV1('foo@bar.com', 'password', 'James', 'Charles');
    const channelOwnerPrivId = authRegisterV1('pollos@hhm.com', 'g00dpassword54', 'Gus', 'Fring');
    const channelIdPriv = channelsCreateV1(channelOwnerPrivId.authUserId, 'Priv', false);

    const fakeChannelId = channelIdPriv.channelId - 1;

    expect(channelDetailsV1(channelOwnerPrivId.authUserId, fakeChannelId)).toEqual({ error: 'error' });
  });

  test('Testing when UserId does not refer to a valid user', () => {
    clearV1();

    const globalOwnerId = authRegisterV1('foo@bar.com', 'password', 'James', 'Charles');
    const channelOwnerPrivId = authRegisterV1('pollos@hhm.com', 'g00dpassword54', 'Gus', 'Fring');
    const channelIdPriv = channelsCreateV1(channelOwnerPrivId.authUserId, 'Priv', false);
    let fakeUserId = channelOwnerPrivId.authUserId + 5;
    if (fakeUserId === globalOwnerId.authUserId) {
      fakeUserId++;
    }

    expect(channelDetailsV1(fakeUserId, channelIdPriv.channelId)).toEqual({ error: 'error' });
  });

  test('Testing when Id is valid but user is not a member of the channel', () => {
    clearV1();

    authRegisterV1('foo@bar.com', 'password', 'James', 'Charles');
    const tempUserId = authRegisterV1('heisenberg@hhm.com', 'AnotherPasword1', 'Walter', 'White');
    const channelOwnerPublicId = authRegisterV1('pollos@hhm.com', 'g00dpassword54', 'Gus', 'Fring');
    const channelIdPublic = channelsCreateV1(channelOwnerPublicId.authUserId, 'Public', true);

    expect(channelDetailsV1(tempUserId.authUserId, channelIdPublic.channelId)).toEqual({ error: 'error' });
  });
});

//===================================== channelJoin =====================================//
describe('Testing channelJoinV1', () => {
  test('Normal joining procedures for public channel, and displaying via channelDetails', () => {
    clear();
    const channelOwnerId = authRegister('chocolate@bar.com', 'g00dpassword', 'Willy', 'Wonka');
    const channelIdPublic = channelsCreate(channelOwnerId.token, 'Boost', true);

    const memberId = authRegister('chicken@bar.com', 'goodpassword', 'Ronald', 'Mcdonald');
    expect(channelJoin(memberId.token, channelIdPublic.channelId)).toStrictEqual({});
    expect(channelDetails(channelOwnerId.token, channelIdPublic.channelId)).toStrictEqual({
      name: 'Boost',
      isPublic: true,
      ownerMembers: [
        {
          uId: channelOwnerId.authUserId,
          email: 'chocolate@bar.com',
          nameFirst: 'Willy',
          nameLast: 'Wonka',
          handleStr: expect.any(String),
        }
      ],
      allMembers: [
        {
          uId: channelOwnerId.authUserId,
          email: 'chocolate@bar.com',
          nameFirst: 'Willy',
          nameLast: 'Wonka',
          handleStr: expect.any(String),
        },
        {
          uId: memberId.authUserId,
          email: 'chicken@bar.com',
          nameFirst: 'Ronald',
          nameLast: 'Mcdonald',
          handleStr: expect.any(String),
        }
      ],
    });
  });

  test('Global owner joining private channel', () => {
    clear();
    const globalOwnerId = authRegister('foo@bar.com', 'password', 'James', 'Charles');

    const channelOwnerId = authRegister('chocolate@bar.com', 'g00dpassword', 'Willy', 'Wonka');
    const channelIdPrivate = channelsCreate(channelOwnerId.token, 'BoostPrivate', false);

    expect(channelJoin(globalOwnerId.token, channelIdPrivate.channelId)).toStrictEqual({});
    expect(channelDetails(channelOwnerId.token, channelIdPrivate.channelId)).toStrictEqual({
      name: 'BoostPrivate',
      isPublic: false,
      ownerMembers: [
        {
          uId: channelOwnerId.authUserId,
          email: 'chocolate@bar.com',
          nameFirst: 'Willy',
          nameLast: 'Wonka',
          handleStr: expect.any(String),
        }
      ],
      allMembers: [
        {
          uId: channelOwnerId.authUserId,
          email: 'chocolate@bar.com',
          nameFirst: 'Willy',
          nameLast: 'Wonka',
          handleStr: expect.any(String),
        },
        {
          uId: globalOwnerId.authUserId,
          email: 'foo@bar.com',
          nameFirst: 'James',
          nameLast: 'Charles',
          handleStr: expect.any(String),
        }
      ],
    });
  });
});

describe('Error checking channelJoinV1', () => {
  test('Testing invalid authUserId, channelId, and already a member', () => {
    clear();
    const channelOwnerId = authRegister('chocolate@bar.com', 'g00dpassword', 'Willy', 'Wonka');
    const channelId = channelsCreate(channelOwnerId.token, 'Boost', true);

    const memberId = authRegister('chicken@bar.com', 'goodpassword', 'Ronald', 'Mcdonald');
    let invalidMemberToken = memberId.token + 'hi';
    if (invalidMemberToken === channelOwnerId.token) {
      invalidMemberToken += 'bye';
    }
    const invalidChannelId = channelId.channelId + 1;
    expect(channelJoin(invalidMemberToken, channelId.channelId)).toStrictEqual({ error: 'error' }); // invalid memberId
    expect(channelJoin(memberId.token, invalidChannelId)).toStrictEqual({ error: 'error' }); // invalid channelId

    // Testing already a member
    expect(channelJoin(memberId.token, channelId.channelId)).toStrictEqual({});
    expect(channelJoin(memberId.token, channelId.channelId)).toStrictEqual({ error: 'error' });
  });

  test('Testing normal user cannot join private channel', () => {
    clear();
    const channelOwnerId = authRegister('chocolate@bar.com', 'g00dpassword', 'Willy', 'Wonka');
    const channelId = channelsCreate(channelOwnerId.token, 'BoostPrivate', false); // private channel

    const memberId = authRegister('chicken@bar.com', 'goodpassword', 'Ronald', 'Mcdonald');
    expect(channelJoin(memberId.token, channelId.channelId)).toStrictEqual({ error: 'error' }); // can't join private channel
  });
});

describe('Testing channelInviteV1', () => {
  test('Testing normal invitation procedures with public channel', () => {
    clear();
    const channelOwnerId = authRegister('chocolate@bar.com', 'g00dpassword', 'Willy', 'Wonka');
    const channelId = channelsCreate(channelOwnerId.token, 'Boost', true);

    const memberId = authRegister('chicken@bar.com', 'goodpassword', 'Ronald', 'Mcdonald'); // normal user
    expect(channelInvite(channelOwnerId.token, channelId.channelId, memberId.authUserId)).toStrictEqual({});
    expect(channelDetails(channelOwnerId.token, channelId.channelId)).toStrictEqual({
      name: 'Boost',
      isPublic: true,
      ownerMembers: [
        {
          uId: channelOwnerId.authUserId,
          email: 'chocolate@bar.com',
          nameFirst: 'Willy',
          nameLast: 'Wonka',
          handleStr: expect.any(String),
        }
      ],
      allMembers: [
        {
          uId: channelOwnerId.authUserId,
          email: 'chocolate@bar.com',
          nameFirst: 'Willy',
          nameLast: 'Wonka',
          handleStr: expect.any(String),
        },
        {
          uId: memberId.authUserId,
          email: 'chicken@bar.com',
          nameFirst: 'Ronald',
          nameLast: 'Mcdonald',
          handleStr: expect.any(String),
        }
      ],
    });
  });
});

describe('Error checking channelInviteV1', () => {
  test('Testing invalid token, channelId, and uId, and already a member', () => {
    clear();
    const channelOwnerId = authRegister('chocolate@bar.com', 'g00dpassword', 'Willy', 'Wonka');
    const channelId = channelsCreate(channelOwnerId.token, 'Boost', true);
    const memberId = authRegister('chicken@bar.com', 'goodpassword', 'Ronald', 'Mcdonald');

    let invalidMemberId = memberId.authUserId + 1;
    if (invalidMemberId === channelOwnerId.authUserId) {
      invalidMemberId++;
    }

    let invalidToken = memberId.token + 'hi';
    if (invalidToken === channelOwnerId.token) {
      invalidToken += 'bye';
    }

    const invalidChannelId = channelId.channelId + 1;

    expect(channelInvite(invalidToken, channelId.channelId, memberId.authUserId)).toStrictEqual({ error: 'error' });
    expect(channelInvite(channelOwnerId.token, invalidChannelId, memberId.authUserId)).toStrictEqual({ error: 'error' });
    expect(channelInvite(channelOwnerId.token, channelId.channelId, invalidMemberId)).toStrictEqual({ error: 'error' });

    channelInvite(channelOwnerId.token, channelId.channelId, memberId.authUserId); // channel owner invites normal user
    expect(channelInvite(channelOwnerId.token, channelId.channelId, memberId.authUserId)).toStrictEqual({ error: 'error' }); // invites again
  });
  // TODO
  test('Non-member inviting a non-member, and inviting itself', () => {
    clearV1();
    const channelOwnerId = authRegisterV1('chocolate@bar.com', 'g00dpassword', 'Willy', 'Wonka');
    const channelId = channelsCreateV1(channelOwnerId.authUserId, 'Boost', true);

    const nonMember1 = authRegisterV1('ethan@bar.com', 'okpassword', 'Ethan', 'Chew');
    const nonMember2 = authRegisterV1('john@bar.com', 'decentpassword', 'John', 'Wick');
    expect(channelInviteV1(nonMember1.authUserId, channelId.channelId, nonMember2.authUserId)).toStrictEqual({ error: 'error' })
    expect(channelInviteV1(nonMember1.authUserId, channelId.channelId, nonMember1.authUserId)).toStrictEqual({ error: 'error' });
  });

  test('globalowner(nonmember) inviting non-member, and inviting itself', () => {
    clearV1();
    const globalowner = authRegisterV1('ahahahahahahaha@bar.com', 'g00dsdadpassword', 'itsme', 'mario');
    const channelOwnerId = authRegisterV1('chocolate@bar.com', 'g00dpassword', 'Willy', 'Wonka');
    const channelId = channelsCreateV1(channelOwnerId.authUserId, 'Boost', true);

    const nonMember1 = authRegisterV1('ethan@bar.com', 'okpassword', 'Ethan', 'Chew');
    expect(channelInviteV1(globalowner.authUserId, channelId.channelId, nonMember1.authUserId)).toStrictEqual({ error: 'error' });
    expect(channelInviteV1(globalowner.authUserId, channelId.channelId, globalowner.authUserId)).toStrictEqual({ error: 'error' });
  });
});

//===================================== channelMessages =====================================//
describe('test block for channelMessagesV1', () => {
  test('invalid input(invalid user and channel)', () => {
    clearV1();

    const personId = authRegisterV1('ethanchew@mail.com', 'paswword123', 'ethan', 'chew');
    const channelId = channelsCreateV1(personId.authUserId, 'achannel', true);

    clearV1();

    expect(channelMessagesV1(personId.authUserId, channelId.channelId, 0)).toStrictEqual({ error: 'error' });
  });

  test('invalid input(user not in channel)', () => {
    clearV1();

    const personId = authRegisterV1('ethanchew@mail.com', 'paswword123', 'ethan', 'chew');
    const person2 = authRegisterV1('donaldduck@mail.com', 'duck4life', 'donald', 'duck');
    const channelId = channelsCreateV1(personId.authUserId, 'achannel', true);

    expect(channelMessagesV1(person2.authUserId, channelId.channelId, 0)).toStrictEqual({ error: 'error' });
  });

  test('testing for invalid input(start > amount)', () => {
    clearV1();

    const personId = authRegisterV1('tony@mail.com', 'tonytony1', 'tony', 'yeung');
    const channelId = channelsCreateV1(personId.authUserId, 'tonyschannel', true);

    expect(channelMessagesV1(personId.authUserId, channelId.channelId, 1)).toStrictEqual({
      error: 'error'
    });
  });

  test('testing for invalid input(start < 0)', () => {
    clearV1();

    const personId = authRegisterV1('tony@mail.com', 'tonytony1', 'tony', 'yeung');
    const channelId = channelsCreateV1(personId.authUserId, 'tonyschannel', true);

    expect(channelMessagesV1(personId.authUserId, channelId.channelId, -10)).toStrictEqual({
      error: 'error'
    });
  });

  test('testing for valid input(empty messages)', () => {
    clearV1();

    const personId = authRegisterV1('tony@mail.com', 'tonytony1', 'tony', 'yeung');
    const channelId = channelsCreateV1(personId.authUserId, 'tonyschannel', true);

    expect(channelMessagesV1(personId.authUserId, channelId.channelId, 0)).toStrictEqual({
      messages: [],
      start: 0,
      end: -1,
    });
  });
});
