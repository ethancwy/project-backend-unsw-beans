import { channelDetailsV2, channelJoinV2, channelInviteV2, channelMessagesV2 } from './channel';
import { channelsCreateV2 } from './channels';
import { authRegisterV2 } from './auth';
import { clearV1 } from './other';

import {
  authRegister, channelsCreate, channelDetails,
  channelJoin, channelInvite, clear
} from './global'

describe('Testing that channelDetailsV2 works standard', () => {
  test('when given id, returns relevant info of channels if the user is apart of it', () => {
    clearV1();

    authRegisterV2('foo@bar.com', 'password', 'James', 'Charles');
    const channelOwnerId = authRegisterV2('chocolate@bar.com', 'g00dpassword', 'Willy', 'Wonka');
    const channelIdPublic = channelsCreateV2(channelOwnerId.authUserId, 'Boost', true);

    expect(channelDetailsV2(channelOwnerId.authUserId, channelIdPublic.channelId)).toEqual(
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

    authRegisterV2('foo@bar.com', 'password', 'James', 'Charles');
    const channelOwnerPrivId = authRegisterV2('pollos@hhm.com', 'g00dpassword54', 'Gus', 'Fring');
    const channelIdPriv = channelsCreateV2(channelOwnerPrivId.authUserId, 'Priv', false);

    expect(channelDetailsV2(channelOwnerPrivId.authUserId, channelIdPriv.channelId)).toEqual(
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
    clearV1();

    authRegisterV2('foo@bar.com', 'password', 'James', 'Charles');
    const channelOwnerPrivId = authRegisterV2('pollos@hhm.com', 'g00dpassword54', 'Gus', 'Fring');
    const channelIdPriv = channelsCreateV2(channelOwnerPrivId.authUserId, 'Priv', false);

    const fakeChannelId = channelIdPriv.channelId - 1;

    expect(channelDetailsV2(channelOwnerPrivId.authUserId, fakeChannelId)).toEqual({ error: 'error' });
  });

  test('Testing when UserId does not refer to a valid user', () => {
    clearV1();

    const globalOwnerId = authRegisterV2('foo@bar.com', 'password', 'James', 'Charles');
    const channelOwnerPrivId = authRegisterV2('pollos@hhm.com', 'g00dpassword54', 'Gus', 'Fring');
    const channelIdPriv = channelsCreateV2(channelOwnerPrivId.authUserId, 'Priv', false);
    let fakeUserId = channelOwnerPrivId.authUserId + 5;
    if (fakeUserId === globalOwnerId.authUserId) {
      fakeUserId++;
    }

    expect(channelDetailsV2(fakeUserId, channelIdPriv.channelId)).toEqual({ error: 'error' });
  });

  test('Testing when Id is valid but user is not a member of the channel', () => {
    clearV1();

    authRegisterV2('foo@bar.com', 'password', 'James', 'Charles');
    const tempUserId = authRegisterV2('heisenberg@hhm.com', 'AnotherPasword1', 'Walter', 'White');
    const channelOwnerPublicId = authRegisterV2('pollos@hhm.com', 'g00dpassword54', 'Gus', 'Fring');
    const channelIdPublic = channelsCreateV2(channelOwnerPublicId.authUserId, 'Public', true);

    expect(channelDetailsV2(tempUserId.authUserId, channelIdPublic.channelId)).toEqual({ error: 'error' });
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

  test('Non-member inviting a non-member, and inviting itself', () => {
    clearV1();
    const channelOwnerId = authRegister('chocolate@bar.com', 'g00dpassword', 'Willy', 'Wonka');
    const channelId = channelsCreate(channelOwnerId.token, 'Boost', true);

    const nonMember1 = authRegister('ethan@bar.com', 'okpassword', 'Ethan', 'Chew');
    const nonMember2 = authRegister('john@bar.com', 'decentpassword', 'John', 'Wick');
    expect(channelInvite(nonMember1.token, channelId.channelId, nonMember2.authUserId)).toStrictEqual({ error: 'error' })
    expect(channelInvite(nonMember1.token, channelId.channelId, nonMember1.authUserId)).toStrictEqual({ error: 'error' });
  });

  test('globalowner(nonmember) inviting non-member, and inviting itself', () => {
    clearV1();
    const globalowner = authRegister('ahahahahahahaha@bar.com', 'g00dsdadpassword', 'itsme', 'mario');
    const channelOwnerId = authRegister('chocolate@bar.com', 'g00dpassword', 'Willy', 'Wonka');
    const channelId = channelsCreate(channelOwnerId.token, 'Boost', true);

    const nonMember1 = authRegister('ethan@bar.com', 'okpassword', 'Ethan', 'Chew');
    expect(channelInvite(globalowner.token, channelId.channelId, nonMember1.authUserId)).toStrictEqual({ error: 'error' });
    expect(channelInvite(globalowner.token, channelId.channelId, globalowner.authUserId)).toStrictEqual({ error: 'error' });
  });
});

//===================================== channelMessages =====================================//
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

// =================================================== //
//                                                     //
//              Iteration 2 new tests                  //
//                                                     //
// ==================================================  //

//===================================== channelLeave =====================================//
describe('channelLeave success', () => {


});