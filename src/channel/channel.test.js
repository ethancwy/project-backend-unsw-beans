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
    let globalOwnerId = authRegisterV1('foo@bar.com', 'password', 'James', 'Charles'); // global owner

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
        },
        {
          uId: globalOwnerId.uId,
          email: 'foo@bar.com',
          nameFirst: 'James',
          nameLast: 'Charles',
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
  test('Testing invalid authUserId and invalid channelId', () => {
    clearV1();
    let globalOwnerId = authRegisterV1('foo@bar.com', 'password', 'James', 'Charles'); // global owner
    let channelId1 = channelsCreateV1(globalOwnerId, 'Boost', true);

    let memberId = authRegisterV1('chicken@bar.com', 'goodpassword', 'Ronald', 'Mcdonald');
    expect(channelJoinV1('notAnInteger', channelId1)).toStrictEqual({ error: 'error' }); // invalid authUserId
    expect(channelJoinV1(memberId, 'notAnInteger')).toStrictEqual({ error: 'error' }); // invalid channelId

  });
  test('Testing already a member', () => {
    expect(channelJoinV1(memberId, channelId1)).toStrictEqual({});
    expect(channelJoinV1(memberId, channelId1)).toStrictEqual({ error: 'error' });
  });
  test('Testing normal user cannot join private channel', () => {
    let channelOwnerId = authRegisterV1('ethan@bar.com', 'badpassword', 'Ethan', 'Tan'); // channel owner
    let channelId2 = channelsCreateV1(channelOwnerId, 'BoostPrivate', false);  // private channel

    expect(channelJoinV1(memberId, channelId2)).toStrictEqual({ error: 'error' }); // can't join private channel
  });

});

describe('Testing channelInviteV1', () => {
  test('Testing normal invitation procedures with public channel', () => {
    clearV1();
    let globalOwnerId = authRegisterV1('foo@bar.com', 'password', 'James', 'Charles'); // global owner
    let channelId = channelsCreateV1(globalOwnerId, 'Boost', true);

    let memberId = authRegisterV1('chicken@bar.com', 'goodpassword', 'Ronald', 'Mcdonald'); // normal user

    expect(channelInviteV1(globalOwnerId, channelId, memberId)).toStrictEqual({});
    expect(channelDetailsV1(globalOwnerId, channelId)).toStrictEqual({
      name: 'Boost',
      isPublic: true,
      ownerMembers: [
        {
          uId: globalOwnerId.uId,
          email: 'foo@bar.com',
          nameFirst: 'James',
          nameLast: 'Charles',
          handleStr: expect.any(String),
        }
      ],
      allMembers: [
        {
          uId: globalOwnerId.uId,
          email: 'foo@bar.com',
          nameFirst: 'James',
          nameLast: 'Charles',
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
  test('Testing Already member of channel', () => {
    expect(channelInviteV1(globalOwnerId, channelId, memberId)).toStrictEqual({ error: 'error' });
  });
  test('Invalid authUserId, channelId, and uId', () => {
    expect(channelInviteV1('notAnInteger', channelId, memberId)).toStrictEqual({ error: 'error' });
    expect(channelInviteV1(globalOwnerId, 'notAnInteger', memberId)).toStrictEqual({ error: 'error' });
    expect(channelInviteV1(globalOwnerId, channelId, 'notAnInteger')).toStrictEqual({ error: 'error' });
  });
  let nonMember1 = authRegisterV1('ethan@bar.com', 'okpassword', 'Ethan', 'Chew');
  let nonMember2 = authRegisterV1('john@bar.com', 'decentpassword', 'John', 'Wick');

  test('Non-member inviting a non-member', () => {
    expect(channelInviteV1(nonMember1, channelId, nonMember2)).toStrictEqual({ error: 'error' });
  });

});


