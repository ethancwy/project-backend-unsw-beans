import { channelDetailsV1, channelJoinV1, channelInviteV1 } from './channel.js'
import channelsCreateV1 from '../channels/channels.js'
import authRegisterV1 from '../auth/auth.js'
import clearV1 from '../other/other.js'

describe('Testing that channelDetailsV1 works standard', () => {

  test('when given id, returns relevant info of channels if the user is apart of it', () => {
    clearV1();

    let globalOwnerId = authRegisterV1('foo@bar.com', 'password', 'James', 'Charles');
    let channelOwnerId = authRegisterV1('chocolate@bar.com', 'g00dpassword', 'Willy', 'Wonka');
    let channelIdPublic = channelsCreateV1(channelOwnerId, 'Boost', true);

    expect(channelDetailsV1(channelOwnerId, channelIdPublic)).toEqual(
      {
        name: 'Boost',
        isPublic: true,
        ownerMembers: [
          {
            uId: channelOwnerId.uId,
            email: 'chocolate@bar.com',
            nameFirst: 'Willy',
            nameLast: 'Wonka',
            handleStr: expect.any(String), 
          },
        ],
        allMembers: [
          {
            uId: channelOwnerId.uId,
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
    let channelOwnerPrivId = authRegisterV1('pollos@hhm.com', 'g00dpassword54', 'Gus', 'Fring');
    let channelIdPriv = channelsCreateV1(channelOwnerPrivId, 'Priv', false);
    let memberId = authRegisterV1('saul@hhm.com', 'greAtPassword34', 'James', 'McGill');
    
    expect(channelInviteV1(channelOwnerPrivId, channelIdPriv, memberId)).toEqual({});
    expect(channelInviteV1(channelOwnerId, channelIdPublic, memberId)).toEqual({});

    expect(channelDetailsV1(memberId, channelIdPriv)).toEqual(
      {
        name: 'Priv',
        isPublic: false,
        ownerMembers: [
          {
            uId: channelOwnerPrivId.uId,
            email: 'pollos@hhm.com',
            nameFirst: 'Gus',
            nameLast: 'Fring',
            handleStr: expect.any(String), 
          },
        ],
        allMembers: [
          {
            uId: channelOwnerPrivId.uId,
            email: 'pollos@hhm.com',
            nameFirst: 'Gus',
            nameLast: 'Fring',
            handleStr: expect.any(String),
          },
          {
            uId: memberId.uId,
            email: 'saul@hhm.com',
            nameFirst: 'James',
            nameLast: 'McGill',
            handleStr: expect.any(String),
          },
        ],  
      },
    );
  })
});

describe('Testing channelDetailsV1 edge cases', () => {

  test('Testing when channelId does not refer to a valid channel', () => {
    let fakeChannelId = -100;

    expect(channelDetailsV1(memberId, fakeChannelId)).toEqual({ error: 'error' });
  });

  test('Testing when UserId does not refer to a valid user', () => {
    let fakeUserId = -10;

    expect(channelDetailsV1(fakeUserId, channelIdPublic)).toEqual({ error: 'error' });
  });

  test('Testing when Id is valid but user is not a member of the channel', () => {
    let tempUserId = authRegisterV1('heisenberg@hhm.com', 'AnotherPasword1', 'Walter', 'White');

    expect(channelDetailsV1(tempUserId, channelIdPublic)).toEqual({ error: 'error' });
  });
});


