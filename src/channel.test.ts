import {
  authRegister, channelsCreate, channelDetails,
  channelJoin, channelInvite, clear, channelLeave
} from './global';

describe('Testing that channelDetailsV2 works standard', () => {
  test('when given id, returns relevant info of channels if the user is apart of it', () => {
    clear();
    const channelOwnerId = authRegister('chocolate@bar.com', 'g00dpassword', 'Willy', 'Wonka');
    const channelIdPublic = channelsCreate(channelOwnerId.token, 'Boost', true);

    expect(channelDetails(channelOwnerId.token, channelIdPublic.channelId)).toEqual(
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
    clear();
    const channelOwnerPrivId = authRegister('pollos@hhm.com', 'g00dpassword54', 'Gus', 'Fring');
    const channelIdPriv = channelsCreate(channelOwnerPrivId.token, 'Priv', false);

    expect(channelDetails(channelOwnerPrivId.token, channelIdPriv.channelId)).toEqual(
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

describe('Testing channelDetailsV2 edge cases', () => {
  test('Testing when channelId does not refer to a valid channel', () => {
    clear();
    const channelOwnerPrivId = authRegister('pollos@hhm.com', 'g00dpassword54', 'Gus', 'Fring');
    const channelIdPriv = channelsCreate(channelOwnerPrivId.token, 'Priv', false);
    const fakeChannelId = channelIdPriv.channelId - 1;

    expect(channelDetails(channelOwnerPrivId.token, fakeChannelId)).toEqual({ error: 'error' });
  });

  test('Testing invalid token', () => {
    clear();
    const channelOwnerPrivId = authRegister('pollos@hhm.com', 'g00dpassword54', 'Gus', 'Fring');
    const channelIdPriv = channelsCreate(channelOwnerPrivId.token, 'Priv', false);

    let fakeToken = channelOwnerPrivId.token + 'hi';
    if (fakeToken === channelOwnerPrivId.token) {
      fakeToken += 'bye';
    }

    expect(channelDetails(fakeToken, channelIdPriv.channelId)).toEqual({ error: 'error' });
  });

  test('Testing when Id is valid but user is not a member of the channel', () => {
    clear();
    const tempUserId = authRegister('heisenberg@hhm.com', 'AnotherPasword1', 'Walter', 'White');
    const channelOwnerPublicId = authRegister('pollos@hhm.com', 'g00dpassword54', 'Gus', 'Fring');
    const channelIdPublic = channelsCreate(channelOwnerPublicId.token, 'Public', true);

    expect(channelDetails(tempUserId.token, channelIdPublic.channelId)).toEqual({ error: 'error' });
  });
});

// channelJoin
describe('Testing channelJoinV2', () => {
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

describe('Error checking channelJoinV2', () => {
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

describe('Testing channelInviteV2', () => {
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

describe('Error checking channelInviteV2', () => {
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

  test('Non-member inviting a non-member, and inviting itself', () => {
    clear();
    const channelOwnerId = authRegister('chocolate@bar.com', 'g00dpassword', 'Willy', 'Wonka');
    const channelId = channelsCreate(channelOwnerId.token, 'Boost', true);

    const nonMember1 = authRegister('ethan@bar.com', 'okpassword', 'Ethan', 'Chew');
    const nonMember2 = authRegister('john@bar.com', 'decentpassword', 'John', 'Wick');
    expect(channelInvite(nonMember1.token, channelId.channelId, nonMember2.authUserId)).toStrictEqual({ error: 'error' });
    expect(channelInvite(nonMember1.token, channelId.channelId, nonMember1.authUserId)).toStrictEqual({ error: 'error' });
  });

  test('globalowner(nonmember) inviting non-member, and inviting itself', () => {
    clear();
    const globalowner = authRegister('ahahahahahahaha@bar.com', 'g00dsdadpassword', 'itsme', 'mario');
    const channelOwnerId = authRegister('chocolate@bar.com', 'g00dpassword', 'Willy', 'Wonka');
    const channelId = channelsCreate(channelOwnerId.token, 'Boost', true);

    const nonMember1 = authRegister('ethan@bar.com', 'okpassword', 'Ethan', 'Chew');
    expect(channelInvite(globalowner.token, channelId.channelId, nonMember1.authUserId)).toStrictEqual({ error: 'error' });
    expect(channelInvite(globalowner.token, channelId.channelId, globalowner.authUserId)).toStrictEqual({ error: 'error' });
  });
});

// channelLeaveV1
describe('Testing channelLeaveV1 success', () => {
  test('Testing channel owner leaving channel, and channel remaining', () => {
    clear();
    const channelOwnerId = authRegister('chocolate@bar.com', 'g00dpassword', 'Willy', 'Wonka');
    const memberId = authRegister('chicken@bar.com', 'goodpassword', 'Ronald', 'Mcdonald');

    const channelId = channelsCreate(channelOwnerId.token, 'Boost', true);
    channelJoin(memberId.token, channelId.channelId);

    expect(channelLeave(channelOwnerId.token, channelId.channelId)).toStrictEqual({});

    // expect error since channelOwner no longer in channel
    expect(channelDetails(channelOwnerId.token, channelId.channelId)).toStrictEqual({ error: 'error' });
  });
});

describe('Error checking channelLeaveV1', () => {
  test('Invalid channelId & token', () => {
    const channelOwnerId = authRegister('chocolate@bar.com', 'g00dpassword', 'Willy', 'Wonka');
    const channelId = channelsCreate(channelOwnerId.token, 'Boost', true);

    const nonMember = authRegister('john@bar.com', 'decentpassword', 'John', 'Wick');

    const invalidChannelId = channelId.channelId + 1;
    let invalidToken = channelOwnerId.token + 'hi';
    if (invalidToken === nonMember.token) {
      invalidToken += 'bye';
    }
    expect(channelLeave(channelOwnerId.token, invalidChannelId)).toStrictEqual({ error: 'error' }); // invalid channel
    expect(channelLeave(invalidToken, channelId.channelId)).toStrictEqual({ error: 'error' }); // invalid token
    expect(channelLeave(nonMember.token, channelId.channelId)).toStrictEqual({ error: 'error' }); // nonMember
  });
});

// channelAddOwnerV1
