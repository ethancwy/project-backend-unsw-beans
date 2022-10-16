import { postRequest, getRequest, deleteRequest } from './global'
import { port, url } from './config.json';
const SERVER_URL = `${url}:${port}`;

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

describe('Testing channelJoinV1', () => {
  test('Normal joining procedures for public channel, and displaying via channelDetails', () => {
    deleteRequest(SERVER_URL + '/clear/v1', {});
    const channelOwnerId = postRequest(SERVER_URL + '/auth/register/v2', {
      email: 'chocolate@bar.com',
      password: 'g00dpassword',
      nameFirst: 'Willy',
      nameLast: 'Wonka',
    });
    const channelIdPublic = postRequest(SERVER_URL + '/channels/create/v2', {
      token: channelOwnerId.token,
      name: 'Boost',
      isPublic: true,
    });
    const memberId = postRequest(SERVER_URL + '/auth/register/v2', {
      email: 'chicken@bar.com',
      password: 'goodpassword',
      nameFirst: 'Ronald',
      nameLast: 'Mcdonald',
    });
    expect(postRequest(SERVER_URL + '/channel/join/v2', {
      token: memberId.token,
      channelId: channelIdPublic.channelId,
    })).toStrictEqual({});

    expect(getRequest(SERVER_URL + '/channel/details/v2', {
      token: channelOwnerId.token,
      channelId: channelIdPublic.channelId,
    })).toStrictEqual({
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
    deleteRequest(SERVER_URL + '/clear/v1', {});
    const globalOwnerId = postRequest(SERVER_URL + '/auth/register/v2', {
      email: 'foo@bar.com',
      password: 'password',
      nameFirst: 'James',
      nameLast: 'Charles',
    });
    const channelOwnerId = postRequest(SERVER_URL + '/auth/register/v2', {
      email: 'chocolate@bar.com',
      password: 'g00dpassword',
      nameFirst: 'Willy',
      nameLast: 'Wonka',
    });

    const channelIdPrivate = postRequest(SERVER_URL + '/channels/create/v2', {
      token: channelOwnerId.token,
      name: 'BoostPrivate',
      isPublic: false,
    });

    postRequest(SERVER_URL + '/channel/join/v2', {
      token: globalOwnerId.token,
      channelId: channelIdPrivate.channelId,
    });

    expect(getRequest(SERVER_URL + '/channel/details/v2', {
      token: channelOwnerId.token,
      channelId: channelIdPrivate.channelId,
    })).toStrictEqual({
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
    deleteRequest(SERVER_URL + '/clear/v1', {});
    const channelOwnerId = postRequest(SERVER_URL + '/auth/register/v2', {
      email: 'chocolate@bar.com',
      password: 'g00dpassword',
      nameFirst: 'Willy',
      nameLast: 'Wonka',
    });
    const channelId = postRequest(SERVER_URL + '/channels/create/v2', {
      token: channelOwnerId.token,
      name: 'Boost',
      isPublic: true,
    });
    const memberId = postRequest(SERVER_URL + '/auth/register/v2', {
      email: 'chicken@bar.com',
      password: 'goodpassword',
      nameFirst: 'Ronald',
      nameLast: 'Mcdonald',
    });
    let invalidMemberToken = memberId.token + 'hi';
    if (invalidMemberToken === channelOwnerId.token) {
      invalidMemberToken += 'bye';
    }
    const invalidChannelId = channelId.channelId + 1;
    expect(postRequest(SERVER_URL + '/channel/join/v2', {
      token: invalidMemberToken,
      channelId: channelId.channelId,
    })).toStrictEqual({ error: 'error' }); // invalid memberToken
    expect(postRequest(SERVER_URL + '/channel/join/v2', {
      token: memberId.token,
      channelId: invalidChannelId,
    })).toStrictEqual({ error: 'error' }); // invalid channelId

    // Testing already a member
    postRequest(SERVER_URL + '/channel/join/v2', {
      token: memberId.token,
      channelId: channelId.channelId,
    }); // join channel
    expect(postRequest(SERVER_URL + '/channel/join/v2', {
      token: memberId.token,
      channelId: channelId.channelId,
    })).toStrictEqual({ error: 'error' }); // already a member
  });

  test('Testing normal user cannot join private channel', () => {
    deleteRequest(SERVER_URL + '/clear/v1', {});
    const channelOwnerId = postRequest(SERVER_URL + '/auth/register/v2', {
      email: 'chocolate@bar.com',
      password: 'g00dpassword',
      nameFirst: 'Willy',
      nameLast: 'Wonka',
    });
    const channelIdPrivate = postRequest(SERVER_URL + '/channels/create/v2', {
      token: channelOwnerId.token,
      name: 'BoostPrivate',
      isPublic: false,
    }); // private channel

    const memberId = postRequest(SERVER_URL + '/auth/register/v2', {
      email: 'chicken@bar.com',
      password: 'goodpassword',
      nameFirst: 'Ronald',
      nameLast: 'Mcdonald',
    });

    expect(postRequest(SERVER_URL + '/channel/join/v2', {
      token: memberId.token,
      channelId: channelIdPrivate.channelId,
    })).toStrictEqual({ error: 'error' }); // norma user cannot join private channel
  });
});

describe('Testing channelInviteV1', () => {
  test('Testing normal invitation procedures with public channel', () => {
    deleteRequest(SERVER_URL + '/clear/v1', {});
    const channelOwnerId = postRequest(SERVER_URL + '/auth/register/v2', {
      email: 'chocolate@bar.com',
      password: 'g00dpassword',
      nameFirst: 'Willy',
      nameLast: 'Wonka',
    });
    const channelId = postRequest(SERVER_URL + '/channels/create/v2', {
      token: channelOwnerId.token,
      name: 'Boost',
      isPublic: true,
    });

    const memberId = postRequest(SERVER_URL + '/auth/register/v2', {
      email: 'chicken@bar.com',
      password: 'goodpassword',
      nameFirst: 'Ronald',
      nameLast: 'Mcdonald',
    }); // normal user

    expect(postRequest(SERVER_URL + '/channel/invite/v2', {
      token: channelOwnerId.token,
      channelId: channelId.channelId,
      uId: memberId.authUserId,
    })).toStrictEqual({});

    expect(getRequest(SERVER_URL + '/channel/details/v2', {
      token: channelOwnerId.token,
      channelId: channelId.channelId,
    })).toStrictEqual({
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
  test('Testing invalid authUserId, channelId, and uId, and already a member', () => {
    deleteRequest(SERVER_URL + '/clear/v1', {});
    const channelOwnerId = postRequest(SERVER_URL + '/auth/register/v2', {
      email: 'chocolate@bar.com',
      password: 'g00dpassword',
      nameFirst: 'Willy',
      nameLast: 'Wonka',
    });
    const channelId = postRequest(SERVER_URL + '/channels/create/v2', {
      token: channelOwnerId.token,
      name: 'Boost',
      isPublic: true,
    });
    const memberId = postRequest(SERVER_URL + '/auth/register/v2', {
      email: 'chicken@bar.com',
      password: 'goodpassword',
      nameFirst: 'Ronald',
      nameLast: 'Mcdonald',
    });

    let invalidMemberId = memberId.authUserId + 1;
    if (invalidMemberId === channelOwnerId.authUserId) {
      invalidMemberId++;
    }

    let invalidToken = memberId.token + 'hi';
    if (invalidToken === channelOwnerId.token) {
      invalidToken += 'bye';
    }

    const invalidChannelId = channelId.channelId + 1;

    expect(postRequest(SERVER_URL + '/channel/invite/v2', {
      token: invalidToken,
      channelId: channelId.channelId,
      uId: memberId.authUserId,
    })).toStrictEqual({ error: 'error' });

    expect(postRequest(SERVER_URL + '/channel/invite/v2', {
      token: channelOwnerId.token,
      channelId: invalidChannelId,
      uId: memberId.authUserId,
    })).toStrictEqual({ error: 'error' });

    expect(postRequest(SERVER_URL + '/channel/invite/v2', {
      token: channelOwnerId.token,
      channelId: channelId.channelId,
      uId: invalidMemberId,
    })).toStrictEqual({ error: 'error' });

    postRequest(SERVER_URL + '/channel/invite/v2', {
      token: channelOwnerId.token,
      channelId: channelId.channelId,
      uId: memberId.authUserId,
    }); // channel owner invites normal user

    expect(postRequest(SERVER_URL + '/channel/invite/v2', {
      token: channelOwnerId.token,
      channelId: channelId.channelId,
      uId: memberId.authUserId,
    })).toStrictEqual({ error: 'error' });  // invites again
  });

  test('Non-member inviting a non-member and inviting himself', () => {
    deleteRequest(SERVER_URL + '/clear/v1', {});
    const channelOwnerId = postRequest(SERVER_URL + '/auth/register/v2', {
      email: 'chocolate@bar.com',
      password: 'g00dpassword',
      nameFirst: 'Willy',
      nameLast: 'Wonka',
    });
    const channelId = postRequest(SERVER_URL + '/channels/create/v2', {
      token: channelOwnerId.token,
      name: 'Boost',
      isPublic: true,
    });

    const nonMember1 = postRequest(SERVER_URL + '/auth/register/v2', {
      email: 'chicken@bar.com',
      password: 'goodpassword',
      nameFirst: 'Ronald',
      nameLast: 'Mcdonald',
    });
    const nonMember2 = postRequest(SERVER_URL + '/auth/register/v2', {
      email: 'john@bar.com',
      password: 'decentpassword',
      nameFirst: 'John',
      nameLast: 'Wick',
    });

    expect(postRequest(SERVER_URL + '/channel/invite/v2', {
      token: nonMember1.token,
      channelId: channelId.channelId,
      uId: nonMember2.authUserId,
    })).toStrictEqual({ error: 'error' });

    expect(postRequest(SERVER_URL + '/channel/invite/v2', {
      token: nonMember1.token,
      channelId: channelId.channelId,
      uId: nonMember1.authUserId,
    })).toStrictEqual({ error: 'error' });

  });

  test('globalowner(nonmember) inviting non-member and itself', () => {
    deleteRequest(SERVER_URL + '/clear/v1', {});
    const globalOwnerId = postRequest(SERVER_URL + '/auth/register/v2', {
      email: 'foo@bar.com',
      password: 'password',
      nameFirst: 'James',
      nameLast: 'Charles',
    });
    const channelOwnerId = postRequest(SERVER_URL + '/auth/register/v2', {
      email: 'chocolate@bar.com',
      password: 'g00dpassword',
      nameFirst: 'Willy',
      nameLast: 'Wonka',
    });
    const channelId = postRequest(SERVER_URL + '/channels/create/v2', {
      token: channelOwnerId.token,
      name: 'Boost',
      isPublic: true,
    });

    const nonMember1 = postRequest(SERVER_URL + '/auth/register/v2', {
      email: 'chicken@bar.com',
      password: 'goodpassword',
      nameFirst: 'Ronald',
      nameLast: 'Mcdonald',
    });
    expect(channelInviteV1(globalOwnerId.token, channelId.channelId, nonMember1.authUserId)).toStrictEqual({ error: 'error' });
    expect(channelInviteV1(globalOwnerId.token, channelId.channelId, globalOwnerId.authUserId)).toStrictEqual({ error: 'error' });
  });
});

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
