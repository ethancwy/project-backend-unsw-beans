import {
  channelJoinV1,
  channelInviteV1,
  channelDetailsV1,
} from './channel';

import { channelsCreateV1 } from '../channels/channels.js'
import { authRegisterV1 } from '../auth/auth.js'
import { clearV1 } from '../other/other.js'

describe('Testing channelJoinV1', () => {
  test('Normal joining procedures for public channel, and displaying via channelDetails', () => {
    clearV1();
    let channelOwnerId = authRegisterV1('chocolate@bar.com', 'g00dpassword', 'Willy', 'Wonka');
    let channelIdPublic = channelsCreateV1(channelOwnerId, 'Boost', true);

    let memberId = authRegisterV1('chicken@bar.com', 'goodpassword', 'Ronald', 'Mcdonald');
    expect(channelJoinV1(memberId, channelIdPublic)).toStrictEqual({});
    expect(channelDetailsV1(channelOwnerId, channelIdPublic)).toStrictEqual({
      name: 'Boost',
      isPublic: true,
      ownerMembers: [
        {
          uId: channelOwnerId.uId,
          email: 'chocolate@bar.com',
          nameFirst: 'Willy',
          nameLast: 'Wonka',
          handleStr: expect.any(String),
        }
      ],
      allMembers: [
        {
          uId: channelOwnerId.uId,
          email: 'chocolate@bar.com',
          nameFirst: 'Willy',
          nameLast: 'Wonka',
          handleStr: expect.any(String),
        },
        {
          uId: memberId.uId,
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
    let channelIdPrivate = channelsCreateV1(channelOwnerId, 'BoostPrivate', false);

    expect(channelJoinV1(globalOwnerId, channelIdPrivate)).toStrictEqual({});
    expect(channelDetailsV1(channelOwnerId, channelIdPrivate)).toStrictEqual({
      name: 'BoostPrivate',
      isPublic: false,
      ownerMembers: [
        {
          uId: channelOwnerId.uId,
          email: 'chocolate@bar.com',
          nameFirst: 'Willy',
          nameLast: 'Wonka',
          handleStr: expect.any(String),
        }
      ],
      allMembers: [
        {
          uId: channelOwnerId.uId,
          email: 'chocolate@bar.com',
          nameFirst: 'Willy',
          nameLast: 'Wonka',
          handleStr: expect.any(String),
        },
        {
          uId: globalOwnerId.uId,
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
    let channelId = channelsCreateV1(channelOwnerId, 'Boost', true);

    let memberId = authRegisterV1('chicken@bar.com', 'goodpassword', 'Ronald', 'Mcdonald');
    let invalidMemberId = memberId + 1;
    let invalidChannelId = channelId + 1;
    expect(channelJoinV1(invalidMemberId, channelId)).toStrictEqual({ error: 'error' }); // invalid memberId
    expect(channelJoinV1(memberId, invalidChannelId)).toStrictEqual({ error: 'error' }); // invalid channelId

    // Testing already a member
    expect(channelJoinV1(memberId, channelId)).toStrictEqual({});
    expect(channelJoinV1(memberId, channelId)).toStrictEqual({ error: 'error' });
  });
  test('Testing normal user cannot join private channel', () => {
    clearV1();
    let channelOwnerId = authRegisterV1('chocolate@bar.com', 'g00dpassword', 'Willy', 'Wonka');
    let channelId = channelsCreateV1(channelOwnerId, 'BoostPrivate', false);  // private channel

    let memberId = authRegisterV1('chicken@bar.com', 'goodpassword', 'Ronald', 'Mcdonald');
    expect(channelJoinV1(memberId, channelId)).toStrictEqual({ error: 'error' }); // can't join private channel
  });

});

describe('Testing channelInviteV1', () => {
  test('Testing normal invitation procedures with public channel', () => {
    clearV1();
    let channelOwnerId = authRegisterV1('chocolate@bar.com', 'g00dpassword', 'Willy', 'Wonka');
    let channelId = channelsCreateV1(channelOwnerId, 'Boost', true);

    let memberId = authRegisterV1('chicken@bar.com', 'goodpassword', 'Ronald', 'Mcdonald'); // normal user
    expect(channelInviteV1(channelOwnerId, channelId, memberId)).toStrictEqual({});
    expect(channelDetailsV1(channelOwnerId, channelId)).toStrictEqual({
      name: 'Boost',
      isPublic: true,
      ownerMembers: [
        {
          uId: channelOwnerId.uId,
          email: 'chocolate@bar.com',
          nameFirst: 'Willy',
          nameLast: 'Wonka',
          handleStr: expect.any(String),
        }
      ],
      allMembers: [
        {
          uId: channelOwnerId.uId,
          email: 'chocolate@bar.com',
          nameFirst: 'Willy',
          nameLast: 'Wonka',
          handleStr: expect.any(String),
        },
        {
          uId: memberId.uId,
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
    clearV1();
    let channelOwnerId = authRegisterV1('chocolate@bar.com', 'g00dpassword', 'Willy', 'Wonka');
    let channelId = channelsCreateV1(channelOwnerId, 'Boost', true);
    let memberId = authRegisterV1('chicken@bar.com', 'goodpassword', 'Ronald', 'Mcdonald');

    let invalidChannelOwnerId = channelOwnerId + 1;
    let invalidChannelId = invalidChannelId + 1;
    let invalidMemberId = memberId + 1;

    expect(channelInviteV1(invalidChannelOwnerId, channelId, memberId)).toStrictEqual({ error: 'error' });
    expect(channelInviteV1(channelOwnerId, invalidChannelId, memberId)).toStrictEqual({ error: 'error' });
    expect(channelInviteV1(channelOwnerId, channelId, invalidMemberId)).toStrictEqual({ error: 'error' });

    channelInviteV1(channelOwnerId, channelId, memberId);  // channel owner invites normal user
    expect(channelInviteV1(channelOwnerId, channelId, memberId)).toStrictEqual({ error: 'error' }); // invites again
  });

  test('Non-member inviting a non-member', () => {
    clearV1();
    let channelOwnerId = authRegisterV1('chocolate@bar.com', 'g00dpassword', 'Willy', 'Wonka');
    let channelId = channelsCreateV1(channelOwnerId, 'Boost', true);

    let nonMember1 = authRegisterV1('ethan@bar.com', 'okpassword', 'Ethan', 'Chew');
    let nonMember2 = authRegisterV1('john@bar.com', 'decentpassword', 'John', 'Wick');
    expect(channelInviteV1(nonMember1, channelId, nonMember2)).toStrictEqual({ error: 'error' });
  });

});


