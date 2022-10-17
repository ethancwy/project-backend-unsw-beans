import { authRegister } from './global';
import { channelsList, channelsCreate, channelsListAll } from './global';
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
