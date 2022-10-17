import { channelsListV2, channelsCreateV2, channelsListAllV2 } from './channels';
import { authRegisterV2 } from './auth';
import { clearV1 } from './other';

import { clear, authRegister, channelsCreate, channelsListAll } from './global';
import { port, url } from './config.json';
const SERVER_URL = `${url}:${port}`;


describe('channelsCreateV2 tests:', () => {
  test('Testing for invalid name(smaller than 1)', () => {
    clearV1();

    const person = authRegisterV2('hao@mail.com', '12345', 'hao', 'yang');

    expect(channelsCreateV2(person.authUserId, '', true)).toStrictEqual({ error: 'error' });
  });

  test('Testing for invalid name(greater than 20)', () => {
    clearV1();

    const person = authRegisterV2('hao@mail.com', '1234512345', 'hao', 'yang');

    expect(channelsCreateV2(person.authUserId, '1234567890qwertyuiopasdfghjkl', true)).toStrictEqual({ error: 'error' });
  });

  test('Testing for invalid authUserId', () => {
    clearV1();

    const person = authRegisterV2('hao@mail.com', '1234512345', 'hao', 'yang');
    clearV1();

    expect(channelsCreateV2(person.authUserId, 'hao/channel', true)).toStrictEqual({ error: 'error' });
  });

  test('Testing for successful creation', () => {
    clearV1();

    const person = authRegisterV2('hao@mail.com', '1234512345', 'hao', 'yang');

    expect(channelsCreateV2(person.authUserId, 'hao/channel', true)).toStrictEqual(
      {
        channelId: expect.any(Number),
      }
    );
  });
});

describe('channelsListV2 tests:', () => {
  test('Testing for invalid authUserId', () => {
    clearV1();

    const person = authRegisterV2('hao@mail.com', '1234512345', 'hao', 'yang');
    clearV1();

    expect(channelsListV2(person.authUserId)).toStrictEqual({ error: 'error' });
  });

  test('Testing for valid input(not in any channel)', () => {
    clearV1();

    const person = authRegisterV2('hao@mail.com', '1234512345', 'hao', 'yang');
    const person2 = authRegisterV2('ethan@mail.com', '5678956789', 'ethan', 'chew');

    channelsCreateV2(person2.authUserId, 'person2/channel1', true);

    expect(channelsListV2(person.authUserId)).toStrictEqual({
      channels: []
    });
  });

  test('Testing for successful creation', () => {
    clearV1();

    const person = authRegisterV2('hao@mail.com', '1234512345', 'hao', 'yang');
    const person2 = authRegisterV2('ethan@mail.com', '5678956789', 'ethan', 'chew');

    const channel1 = channelsCreateV2(person.authUserId, 'hao/channel1', true);
    const channel2 = channelsCreateV2(person.authUserId, 'hao/channel2', true);
    const channel3 = channelsCreateV2(person.authUserId, 'hao/channel3', false);
    channelsCreateV2(person2.authUserId, 'ethan/channel1', true);

    expect(channelsListV2(person.authUserId)).toStrictEqual(
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
describe('Testing channelsListAllV2 standard', () => {
  
  test('Test that the baseline function works', () => {
    clear
    const channelOwnerId = authRegister('chocolate@bar.com', 'g00dpassword', 'Willy', 'Wonka');
    const channelIdPublic = channelsCreate(channelOwnerId.token, 'Boost', true);

    expect(channelsListAll(channelOwnerId.token)).toEqual({
      channels: [
        {
          channelId: channelIdPublic.channelId,
          name: 'Boost',
        }
      ]
    });
  });

  test('test that function works with more than one channel including a private channel', () => {
    clear();
    const globalOwnerId = authRegister('foo@bar.com', 'password', 'James', 'Charles');
    const channelOwnerId = authRegister('chocolate@bar.com', 'g00dpassword', 'Willy', 'Wonka');
    const channelIdPublic = channelsCreate(channelOwnerId.token, 'Boost', true);
    const channelIdPrivate = channelsCreate(channelOwnerId.token, 'priv_channel', false);

    expect(channelsListAll(globalOwnerId.token)).toEqual({
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
    clear();
    const fakeToken = 'shdfjsygfhsdjbf';

    expect(channelsListAll(fakeToken)).toEqual({ error: 'error' });
  });

  /*test('Test for when there are no channels in existence yet', () => {
    clear();
    const user = authRegister('foo@bar.com', 'password', 'James', 'Charles');

    expect(channelsListAll(user.token)).toEqual({
      channels: []
    });
  });*/
});
