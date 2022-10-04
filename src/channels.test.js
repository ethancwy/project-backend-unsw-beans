import { channelsListV1, channelsCreateV1, channelsListAllV1 } from './channels';
import { authRegisterV1, authLoginV1 } from './auth.js';
import { clearV1 } from './other.js';

describe('channelsCreateV1 tests:', () => {
  test('Testing for invalid name(smaller than 1)', () => {
    clearV1();

    const person = authRegisterV1('hao@mail.com', '12345', 'hao', 'yang');

    expect(channelsCreateV1(person.authUserId, '', true)).toStrictEqual({ error: 'error' });
  });

  test('Testing for invalid name(greater than 20)', () => {
    clearV1();

    const person = authRegisterV1('hao@mail.com', '1234512345', 'hao', 'yang');

    expect(channelsCreateV1(person.authUserId, '1234567890qwertyuiopasdfghjkl', true)).toStrictEqual({ error: 'error' });
  });

  test('Testing for invalid authUserId', () => {
    clearV1();

    const person = authRegisterV1('hao@mail.com', '1234512345', 'hao', 'yang');
    clearV1();

    expect(channelsCreateV1(person.authUserId, 'hao/channel', true)).toStrictEqual({ error: 'error' });
  });

  test('Testing for successful creation', () => {
    clearV1();

    const person = authRegisterV1('hao@mail.com', '1234512345', 'hao', 'yang');

    expect(channelsCreateV1(person.authUserId, 'hao/channel', true)).toStrictEqual(
      {
        channelId: expect.any(Number),
      }
    );
  });
});

describe('channelsListV1 tests:', () => {
  test('Testing for invalid authUserId', () => {
    clearV1();

    const invalidId = 9999;

    expect(channelsCreateV1(invalidId, '', true)).toStrictEqual({ error: 'error' });
  });

  test('Testing for successful creation', () => {
    clearV1();

    const person = authRegisterV1('hao@mail.com', '1234512345', 'hao', 'yang');
    const person2 = authRegisterV1('ethan@mail.com', '5678956789', 'ethan', 'chew');

    const channel1 = channelsCreateV1(person.authUserId, 'hao/channel1', true);
    const channel2 = channelsCreateV1(person.authUserId, 'hao/channel2', true);
    const channel3 = channelsCreateV1(person.authUserId, 'hao/channel3', false);
    const channel4 = channelsCreateV1(person2.authUserId, 'ethan/channel1', true);

    expect(channelsListV1(person.authUserId)).toStrictEqual(
      {
        channels: [
          {
            channelId: channel1.channelId,
            name: 'hao/channel1',
          },
          {
            channelId: channel2.channelId,
            name: 'hao/channel2',
          },
          {
            channelId: channel3.channelId,
            name: 'hao/channel3',
          },
        ]
      }
    );
  });

});

// Testing for channelsListAll
describe('Testing channelsListAllV1 standard', () => {

  test('Test that the baseline function works', () => {
    clearV1();

    let globalOwnerId = authRegisterV1('foo@bar.com', 'password', 'James', 'Charles');
    let channelOwnerId = authRegisterV1('chocolate@bar.com', 'g00dpassword', 'Willy', 'Wonka');
    let channelIdPublic = channelsCreateV1(channelOwnerId.authUserId, 'Boost', true);

    expect(channelsListAllV1(channelOwnerId.authUserId)).toEqual({
      channels: [
        {
          channelId: channelIdPublic.channelId,
          name: 'Boost',
        }
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
      channels: [
        {
          channelId: channelIdPublic.channelId,
          name: 'Boost',
        },
        {
          channelId: channelIdPrivate.channelId,
          name: 'priv_channel',
        }
      ]
    });
  });
});

describe('Testing the edge cases', () => {

  test('Test for when authuserId is invalid', () => {
    clearV1();

    let fake_user = -20;

    expect(channelsListAllV1(fake_user)).toEqual(fake_user + " is invalid");
  });

  test('Test for when there are no channels in existence yet', () => {
    clearV1();

    let user = authRegisterV1('foo@bar.com', 'password', 'James', 'Charles');

    expect(channelsListAllV1(user.authUserId)).toEqual({
      channels: []
    });
  });
});