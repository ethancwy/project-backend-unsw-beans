import { authRegister } from './global';
import { channelsCreate, channelsList } from './global';
import { clear } from './global';

describe('channelsCreateV2 tests:', () => {
  test('Testing for invalid name(smaller than 1)', () => {
    clear();

    const person = authRegister('hao@mail.com', '12345', 'hao', 'yang');

    expect(channelsCreate(person.token, '', true)).toStrictEqual({ error: 'error' });
  });

  test('Testing for invalid name(greater than 20)', () => {
    clear();

    const person = authRegister('hao@mail.com', '1234512345', 'hao', 'yang');

    expect(channelsCreate(person.token, '1234567890qwertyuiopasdfghjkl', true)).toStrictEqual({ error: 'error' });
  });

  test('Testing for invalid authUserId', () => {
    clear();

    const person = authRegister('hao@mail.com', '1234512345', 'hao', 'yang');
    clear();

    expect(channelsCreate(person.token, 'hao/channel', true)).toStrictEqual({ error: 'error' });
  });

  test('Testing for successful creation', () => {
    clear();

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
    clear();

    const person = authRegister('hao@mail.com', '1234512345', 'hao', 'yang');
    clear();

    expect(channelsList(person.token)).toStrictEqual({ error: 'error' });
  });

  test('Testing for valid input(not in any channel)', () => {
    clear();

    const person = authRegister('hao@mail.com', '1234512345', 'hao', 'yang');
    const person2 = authRegister('ethan@mail.com', '5678956789', 'ethan', 'chew');

    channelsCreate(person2.token, 'person2/channel1', true);

    expect(channelsList(person.token)).toStrictEqual({
      channels: []
    });
  });

  test('Testing for successful creation', () => {
    clear();

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
