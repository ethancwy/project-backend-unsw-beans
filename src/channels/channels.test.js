import { channelsCreateV1, channelsListAllV1 } from './channels.js';
import { authRegisterV1 } from '../auth/auth.js';
import { clearV1 } from '../other/other.js';

describe ('Testing channelListAllV1 standard', () => {

  test('Test that the baseline function works', () => {
    clearV1();

    let globalOwnerId = authRegisterV1('foo@bar.com', 'password', 'James', 'Charles');
    let channelOwnerId = authRegisterV1('chocolate@bar.com', 'g00dpassword', 'Willy', 'Wonka');
    let channelIdPublic = channelsCreateV1(channelOwnerId.authUserId, 'Boost', true);

    expect(channelsListAllV1(channelOwnerId.authUserId)).toEqual({
      channel: [
        {
        channelId: channelIdPublic.channelId,
        name: 'Boost',
        },
      ]
    });
  });

  test('test that function works with more than one channel including a private channel', () => {
    clearV1();

    let globalOwnerId = authRegisterV1('foo@bar.com', 'password', 'James', 'Charles');
    let channelOwnerId = authRegisterV1('chocolate@bar.com', 'g00dpassword', 'Willy', 'Wonka');
    let channelIdPublic = channelsCreateV1(channelOwnerId.authUserId, 'Boost', true);
    let channelIdPrivate = channelsCreateV1(channelOwnerId.authUserId, 'priv_channel', false);

    expect(channelsListAllV1(globalOwnerId.authUserId)).toEqual({
      channel: [
        {
          channelId: channelIdPublic.channelId,
          name: 'Boost',
        },
        {
          channelId: channelIdPrivate.channelId,
          name: 'priv_channel',
        },
      ]
    });
  });
});

describe ('Testing the edge cases', () => {

  test('Test for when authuserId is invalid', () => {
    clearV1();

    let fake_user = -20;

    expect(channelsListAllV1(fake_user)).toEqual(fake_user + " is invalid");
  });

  test('Test for when there are no channels in existence yet', () => {
    clearV1();

    let user = authRegisterV1('foo@bar.com', 'password', 'James', 'Charles');

    expect(channelsListAllV1(user.authUserId)).toEqual({
      channel: []
    });
  });
});


// may need this later
/*[
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
      },
    ]*/
