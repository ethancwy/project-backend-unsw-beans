import { channelDetailsV1, channelJoinV1, channelInviteV1 } from './channel.js'
import { channelsCreateV1 } from '../channels/channels.js'
import { authRegisterV1, authLoginV1 } from '../auth/auth.js'
import { clearV1 } from '../other/other.js'

describe('Testing that channelDetailsV1 works standard', () => {

  test('when given id, returns relevant info of channels if the user is apart of it', () => {
    clearV1();

    let globalOwnerId = authRegisterV1('foo@bar.com', 'password', 'James', 'Charles');
    let channelOwnerId = authRegisterV1('chocolate@bar.com', 'g00dpassword', 'Willy', 'Wonka');
    let channelIdPublic = channelsCreateV1(channelOwnerId.authUserId, 'Boost', true);

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
      },
    );
  });

  test('works with priv channel and member even if there are multiple channels', () => {
    clearV1();

    let globalOwnerId = authRegisterV1('foo@bar.com', 'password', 'James', 'Charles');
    let channelOwnerPrivId = authRegisterV1('pollos@hhm.com', 'g00dpassword54', 'Gus', 'Fring');
    let channelIdPriv = channelsCreateV1(channelOwnerPrivId.authUserId, 'Priv', false);

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
      },
    );
  })
});

describe('Testing channelDetailsV1 edge cases', () => {

  test('Testing when channelId does not refer to a valid channel', () => {
    clearV1();

    let globalOwnerId = authRegisterV1('foo@bar.com', 'password', 'James', 'Charles');
    let channelOwnerPrivId = authRegisterV1('pollos@hhm.com', 'g00dpassword54', 'Gus', 'Fring');
    let channelIdPriv = channelsCreateV1(channelOwnerPrivId.authUserId, 'Priv', false);

    let fakeChannelId = -100;

    expect(channelDetailsV1(channelOwnerPrivId.authUserId, fakeChannelId.channelId)).toEqual({ error: 'error' });
  });

  test('Testing when UserId does not refer to a valid user', () => {
    clearV1();

    let globalOwnerId = authRegisterV1('foo@bar.com', 'password', 'James', 'Charles');
    let channelOwnerPrivId = authRegisterV1('pollos@hhm.com', 'g00dpassword54', 'Gus', 'Fring');
    let channelIdPriv = channelsCreateV1(channelOwnerPrivId.authUserId, 'Priv', false);
    let fakeUserId = channelOwnerPrivId.authUserId + 5;
    if (fakeUserId = globalOwnerId.authUserId) {
      fakeUserId++;
    }

    expect(channelDetailsV1(fakeUserId, channelIdPriv.channelId)).toEqual({ error: 'error' });
  });

  test('Testing when Id is valid but user is not a member of the channel', () => {
    clearV1();

    let globalOwnerId = authRegisterV1('foo@bar.com', 'password', 'James', 'Charles');
    let tempUserId = authRegisterV1('heisenberg@hhm.com', 'AnotherPasword1', 'Walter', 'White');
    let channelOwnerPublicId = authRegisterV1('pollos@hhm.com', 'g00dpassword54', 'Gus', 'Fring');
    let channelIdPublic = channelsCreateV1(channelOwnerPublicId.authUserId, 'Public', false);


    expect(channelDetailsV1(tempUserId.authUserId, channelIdPublic.channelId)).toEqual({ error: 'error' });
  });
});

describe('Testing channelJoinV1', () => {
  test('Normal joining procedures for public channel, and displaying via channelDetails', () => {
    clearV1();
    let channelOwnerId = authRegisterV1('chocolate@bar.com', 'g00dpassword', 'Willy', 'Wonka');
    let channelIdPublic = channelsCreateV1(channelOwnerId.authUserId, 'Boost', true);

    let memberId = authRegisterV1('chicken@bar.com', 'goodpassword', 'Ronald', 'Mcdonald');
    expect(channelJoinV1(memberId.authUserId, channelIdPublic.channelId)).toStrictEqual({});
    expect(channelDetailsV1(channelOwnerId.authUserId, channelIdPublic.channelId)).toStrictEqual({
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
    let globalOwnerId = authRegisterV1('foo@bar.com', 'password', 'James', 'Charles');

    let channelOwnerId = authRegisterV1('chocolate@bar.com', 'g00dpassword', 'Willy', 'Wonka');
    let channelIdPrivate = channelsCreateV1(channelOwnerId.authUserId, 'BoostPrivate', false);

    expect(channelJoinV1(globalOwnerId.authUserId, channelIdPrivate.channelId)).toStrictEqual({});
    expect(channelDetailsV1(channelOwnerId.authUserId, channelIdPrivate.channelId)).toStrictEqual({
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
    })
  });

});


describe('Error checking channelJoinV1', () => {
  test('Testing invalid authUserId, channelId, and already a member', () => {
    clearV1();
    let channelOwnerId = authRegisterV1('chocolate@bar.com', 'g00dpassword', 'Willy', 'Wonka');
    let channelId = channelsCreateV1(channelOwnerId.authUserId, 'Boost', true);

    let memberId = authRegisterV1('chicken@bar.com', 'goodpassword', 'Ronald', 'Mcdonald');
    let invalidMemberId = memberId.authUserId + 1;
    let invalidChannelId = channelId.channelId + 1;
    expect(channelJoinV1(invalidMemberId, channelId.channelId)).toStrictEqual({ error: 'error' }); // invalid memberId
    expect(channelJoinV1(memberId.authUserId, invalidChannelId)).toStrictEqual({ error: 'error' }); // invalid channelId

    // Testing already a member
    expect(channelJoinV1(memberId.authUserId, channelId.channelId)).toStrictEqual({});
    expect(channelJoinV1(memberId.authUserId, channelId.channelId)).toStrictEqual({ error: 'error' });
  });
  test('Testing normal user cannot join private channel', () => {
    clearV1();
    let channelOwnerId = authRegisterV1('chocolate@bar.com', 'g00dpassword', 'Willy', 'Wonka');
    let channelId = channelsCreateV1(channelOwnerId.authUserId, 'BoostPrivate', false);  // private channel

    let memberId = authRegisterV1('chicken@bar.com', 'goodpassword', 'Ronald', 'Mcdonald');
    expect(channelJoinV1(memberId.authUserId, channelId.channelId)).toStrictEqual({ error: 'error' }); // can't join private channel
  });

});
