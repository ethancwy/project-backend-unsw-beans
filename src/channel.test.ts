import { channelDetailsV2, channelJoinV2, channelInviteV2, channelMessagesV2 } from './channel';
import { channelsCreateV2 } from './channels';
import { authRegisterV2 } from './auth';
import { clearV1 } from './other';

import { clear, authRegister, channelDetails, channelsCreate } from './global';
import { port, url } from './config.json';
const SERVER_URL = `${url}:${port}`;

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
    clearV1();
    const channelOwnerPrivId = authRegister('pollos@hhm.com', 'g00dpassword54', 'Gus', 'Fring');
    const channelIdPriv = channelsCreate(channelOwnerPrivId.token, 'Priv', false);
    let fakeUserId = channelOwnerPrivId.authUserId + 5;
    fakeToken = 'sdfgsjhfgehfjsdf';

    expect(channelDetails(fakeToken, channelIdPriv.channelId)).toEqual({ error: 'error' });
  });

  test('Testing when Id is valid but user is not a member of the channel', () => {
    clear();
    const tempUserId = authRegister('heisenberg@hhm.com', 'AnotherPasword1', 'Walter', 'White');
    const channelOwnerPublicId = authRegister('pollos@hhm.com', 'g00dpassword54', 'Gus', 'Fring');
    const channelIdPublic = channelsCreate(channelOwnerPublicId.authUserId, 'Public', true);

    expect(channelDetails(tempUserId.token, channelIdPublic.channelId)).toEqual({ error: 'error' });
  });
});

describe('Testing channelJoinV2', () => {
  test('Normal joining procedures for public channel, and displaying via channelDetails', () => {
    clearV1();
    const channelOwnerId = authRegisterV2('chocolate@bar.com', 'g00dpassword', 'Willy', 'Wonka');
    const channelIdPublic = channelsCreateV2(channelOwnerId.authUserId, 'Boost', true);

    const memberId = authRegisterV2('chicken@bar.com', 'goodpassword', 'Ronald', 'Mcdonald');
    expect(channelJoinV2(memberId.authUserId, channelIdPublic.channelId)).toStrictEqual({});
    expect(channelDetailsV2(channelOwnerId.authUserId, channelIdPublic.channelId)).toStrictEqual({
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
    clearV1();
    const globalOwnerId = authRegisterV2('foo@bar.com', 'password', 'James', 'Charles');

    const channelOwnerId = authRegisterV2('chocolate@bar.com', 'g00dpassword', 'Willy', 'Wonka');
    const channelIdPrivate = channelsCreateV2(channelOwnerId.authUserId, 'BoostPrivate', false);

    expect(channelJoinV2(globalOwnerId.authUserId, channelIdPrivate.channelId)).toStrictEqual({});
    expect(channelDetailsV2(channelOwnerId.authUserId, channelIdPrivate.channelId)).toStrictEqual({
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
    clearV1();
    const channelOwnerId = authRegisterV2('chocolate@bar.com', 'g00dpassword', 'Willy', 'Wonka');
    const channelId = channelsCreateV2(channelOwnerId.authUserId, 'Boost', true);

    const memberId = authRegisterV2('chicken@bar.com', 'goodpassword', 'Ronald', 'Mcdonald');
    let invalidMemberId = memberId.authUserId + 1;
    if (invalidMemberId === channelOwnerId.authUserId) {
      invalidMemberId++;
    }
    const invalidChannelId = channelId.channelId + 1;
    expect(channelJoinV2(invalidMemberId, channelId.channelId)).toStrictEqual({ error: 'error' }); // invalid memberId
    expect(channelJoinV2(memberId.authUserId, invalidChannelId)).toStrictEqual({ error: 'error' }); // invalid channelId

    // Testing already a member
    expect(channelJoinV2(memberId.authUserId, channelId.channelId)).toStrictEqual({});
    expect(channelJoinV2(memberId.authUserId, channelId.channelId)).toStrictEqual({ error: 'error' });
  });

  test('Testing normal user cannot join private channel', () => {
    clearV1();
    const channelOwnerId = authRegisterV2('chocolate@bar.com', 'g00dpassword', 'Willy', 'Wonka');
    const channelId = channelsCreateV2(channelOwnerId.authUserId, 'BoostPrivate', false); // private channel

    const memberId = authRegisterV2('chicken@bar.com', 'goodpassword', 'Ronald', 'Mcdonald');
    expect(channelJoinV2(memberId.authUserId, channelId.channelId)).toStrictEqual({ error: 'error' }); // can't join private channel
  });
});

describe('Testing channelInviteV2', () => {
  test('Testing normal invitation procedures with public channel', () => {
    clearV1();
    const channelOwnerId = authRegisterV2('chocolate@bar.com', 'g00dpassword', 'Willy', 'Wonka');
    const channelId = channelsCreateV2(channelOwnerId.authUserId, 'Boost', true);

    const memberId = authRegisterV2('chicken@bar.com', 'goodpassword', 'Ronald', 'Mcdonald'); // normal user
    expect(channelInviteV2(channelOwnerId.authUserId, channelId.channelId, memberId.authUserId)).toStrictEqual({});
    expect(channelDetailsV2(channelOwnerId.authUserId, channelId.channelId)).toStrictEqual({
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
  test('Testing invalid authUserId, channelId, and uId, and already a member', () => {
    clearV1();
    const channelOwnerId = authRegisterV2('chocolate@bar.com', 'g00dpassword', 'Willy', 'Wonka');
    const channelId = channelsCreateV2(channelOwnerId.authUserId, 'Boost', true);
    const memberId = authRegisterV2('chicken@bar.com', 'goodpassword', 'Ronald', 'Mcdonald');

    let invalidMemberId = memberId.authUserId + 1;
    if (invalidMemberId === channelOwnerId.authUserId) {
      invalidMemberId++;
    }
    const invalidChannelId = channelId.channelId + 1;

    expect(channelInviteV2(invalidMemberId, channelId.channelId, memberId.authUserId)).toStrictEqual({ error: 'error' });
    expect(channelInviteV2(channelOwnerId.authUserId, invalidChannelId, memberId.authUserId)).toStrictEqual({ error: 'error' });
    expect(channelInviteV2(channelOwnerId.authUserId, channelId.channelId, invalidMemberId)).toStrictEqual({ error: 'error' });

    channelInviteV2(channelOwnerId.authUserId, channelId.channelId, memberId.authUserId); // channel owner invites normal user
    expect(channelInviteV2(channelOwnerId.authUserId, channelId.channelId, memberId.authUserId)).toStrictEqual({ error: 'error' }); // invites again
  });

  test('Non-member inviting a non-member', () => {
    clearV1();
    const channelOwnerId = authRegisterV2('chocolate@bar.com', 'g00dpassword', 'Willy', 'Wonka');
    const channelId = channelsCreateV2(channelOwnerId.authUserId, 'Boost', true);

    const nonMember1 = authRegisterV2('ethan@bar.com', 'okpassword', 'Ethan', 'Chew');
    const nonMember2 = authRegisterV2('john@bar.com', 'decentpassword', 'John', 'Wick');
    expect(channelInviteV2(nonMember1.authUserId, channelId.channelId, nonMember2.authUserId)).toStrictEqual({ error: 'error' });
  });

  test('Non-member inviting itself', () => {
    clearV1();
    const channelOwnerId = authRegisterV2('chocolate@bar.com', 'g00dpassword', 'Willy', 'Wonka');
    const channelId = channelsCreateV2(channelOwnerId.authUserId, 'Boost', true);

    const nonMember1 = authRegisterV2('ethan@bar.com', 'okpassword', 'Ethan', 'Chew');
    expect(channelInviteV2(nonMember1.authUserId, channelId.channelId, nonMember1.authUserId)).toStrictEqual({ error: 'error' });
  });

  test('globalowner(nonmember) inviting non-member', () => {
    clearV1();
    const globalowner = authRegisterV2('ahahahahahahaha@bar.com', 'g00dsdadpassword', 'itsme', 'mario');
    const channelOwnerId = authRegisterV2('chocolate@bar.com', 'g00dpassword', 'Willy', 'Wonka');
    const channelId = channelsCreateV2(channelOwnerId.authUserId, 'Boost', true);

    const nonMember1 = authRegisterV2('ethan@bar.com', 'okpassword', 'Ethan', 'Chew');
    expect(channelInviteV2(globalowner.authUserId, channelId.channelId, nonMember1.authUserId)).toStrictEqual({ error: 'error' });
  });

  test('globalowner(nonmember) inviting itself', () => {
    clearV1();
    const globalowner = authRegisterV2('ahahahahahahaha@bar.com', 'g00dsdadpassword', 'itsme', 'mario');
    const channelOwnerId = authRegisterV2('chocolate@bar.com', 'g00dpassword', 'Willy', 'Wonka');
    const channelId = channelsCreateV2(channelOwnerId.authUserId, 'Boost', true);

    expect(channelInviteV2(globalowner.authUserId, channelId.channelId, globalowner.authUserId)).toStrictEqual({ error: 'error' });
  });
});

describe('test block for channelMessagesV2', () => {
  test('invalid input(invalid user and channel)', () => {
    clearV1();

    const personId = authRegisterV2('ethanchew@mail.com', 'paswword123', 'ethan', 'chew');
    const channelId = channelsCreateV2(personId.authUserId, 'achannel', true);

    clearV1();

    expect(channelMessagesV2(personId.authUserId, channelId.channelId, 0)).toStrictEqual({ error: 'error' });
  });

  test('invalid input(user not in channel)', () => {
    clearV1();

    const personId = authRegisterV2('ethanchew@mail.com', 'paswword123', 'ethan', 'chew');
    const person2 = authRegisterV2('donaldduck@mail.com', 'duck4life', 'donald', 'duck');
    const channelId = channelsCreateV2(personId.authUserId, 'achannel', true);

    expect(channelMessagesV2(person2.authUserId, channelId.channelId, 0)).toStrictEqual({ error: 'error' });
  });

  test('testing for invalid input(start > amount)', () => {
    clearV1();

    const personId = authRegisterV2('tony@mail.com', 'tonytony1', 'tony', 'yeung');
    const channelId = channelsCreateV2(personId.authUserId, 'tonyschannel', true);

    expect(channelMessagesV2(personId.authUserId, channelId.channelId, 1)).toStrictEqual({
      error: 'error'
    });
  });

  test('testing for invalid input(start < 0)', () => {
    clearV1();

    const personId = authRegisterV2('tony@mail.com', 'tonytony1', 'tony', 'yeung');
    const channelId = channelsCreateV2(personId.authUserId, 'tonyschannel', true);

    expect(channelMessagesV2(personId.authUserId, channelId.channelId, -10)).toStrictEqual({
      error: 'error'
    });
  });

  test('testing for valid input(empty messages)', () => {
    clearV1();

    const personId = authRegisterV2('tony@mail.com', 'tonytony1', 'tony', 'yeung');
    const channelId = channelsCreateV2(personId.authUserId, 'tonyschannel', true);

    expect(channelMessagesV2(personId.authUserId, channelId.channelId, 0)).toStrictEqual({
      messages: [],
      start: 0,
      end: -1,
    });
  });
});
