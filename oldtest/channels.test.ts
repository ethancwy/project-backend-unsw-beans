import { authRegister } from './global';
import { channelsList, channelsCreate, channelsListAll } from './global';
import { clear } from './global';

describe('channelsCreateV2 tests:', () => {
  test('Testing for invalid name(smaller than 1)', () => {
    clearV1();

    const person = authRegister('hao@mail.com', '12345', 'hao', 'yang');

    expect(channelsCreate(person.token, '', true)).toStrictEqual({ error: 'error' });
  });

  test('Testing for invalid name(greater than 20)', () => {
    clearV1();

    const person = authRegister('hao@mail.com', '1234512345', 'hao', 'yang');

    expect(channelsCreate(person.token, '1234567890qwertyuiopasdfghjkl', true)).toStrictEqual({ error: 'error' });
  });

  test('Testing for invalid authUserId', () => {
    clearV1();

    const person = authRegister('hao@mail.com', '1234512345', 'hao', 'yang');
    clearV1();

    expect(channelsCreate(person.token, 'hao/channel', true)).toStrictEqual({ error: 'error' });
  });

  test('Testing for successful creation', () => {
    clearV1();

    const person = authRegister('hao@mail.com', '1234512345', 'hao', 'yang');

    expect(channelsCreate(person.token, 'hao/channel', true)).toStrictEqual(
      {
        channelId: expect.any(Number),
      }
    );
  });
});

describe('channelsListV2 tests:', () => {
  test('Testing for invalid authUserId', () => {
    clearV1();

    const person = authRegister('hao@mail.com', '1234512345', 'hao', 'yang');
    clearV1();

    expect(channelsList(person.token)).toStrictEqual({ error: 'error' });
  });

  test('Testing for valid input(not in any channel)', () => {
    clearV1();

    const person = authRegister('hao@mail.com', '1234512345', 'hao', 'yang');
    const person2 = authRegister('ethan@mail.com', '5678956789', 'ethan', 'chew');

    channelsCreate(person2.token, 'person2/channel1', true);

    expect(channelsList(person.token)).toStrictEqual({
      channels: []
    });
  });

  test('Testing for successful creation', () => {
    clearV1();

    const person = authRegister('hao@mail.com', '1234512345', 'hao', 'yang');
    const person2 = authRegister('ethan@mail.com', '5678956789', 'ethan', 'chew');

    const channel1 = channelsCreate(person.token, 'hao/channel1', true);
    const channel2 = channelsCreate(person.token, 'hao/channel2', true);
    const channel3 = channelsCreate(person.token, 'hao/channel3', false);
    channelsCreate(person2.token, 'ethan/channel1', true);

    expect(channelsList(person.token)).toStrictEqual(
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
    clearV1();

    authRegisterV2('foo@bar.com', 'password', 'James', 'Charles');
    const channelOwnerId = authRegisterV2('chocolate@bar.com', 'g00dpassword', 'Willy', 'Wonka');
    const channelIdPublic = channelsCreateV2(channelOwnerId.token, 'Boost', true);

    expect(channelsListAllV2(channelOwnerId.token)).toEqual({
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

    const globalOwnerId = authRegisterV2('foo@bar.com', 'password', 'James', 'Charles');
    const channelOwnerId = authRegisterV2('chocolate@bar.com', 'g00dpassword', 'Willy', 'Wonka');
    const channelIdPublic = channelsCreateV2(channelOwnerId.token, 'Boost', true);
    const channelIdPrivate = channelsCreateV2(channelOwnerId.token, 'priv_channel', false);

    expect(channelsListAllV2(globalOwnerId.token)).toEqual({
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

    const fakeUser = -20;

    expect(channelsListAllV2(fakeUser)).toEqual({ error: 'error' });
  });

  test('Test for when there are no channels in existence yet', () => {
    clearV1();

    const user = authRegisterV2('foo@bar.com', 'password', 'James', 'Charles');

    expect(channelsListAllV2(user.token)).toEqual({
      channels: []
    });
  });
});
