import { authRegister, authLogin, authLogout, clear, search } from './global';
import {
  authRegister, channelsCreate, channelInvite, dmCreate,
  messageSend, messageSendDm, channelLeave, dmLeave } from './global';

clear();

describe('Testing clear function', () => {
  test('Test the user has been cleared', () => {
    authRegister('tony0905@gmail.com', 'Tony0905', 'Tony', 'Yeung');
    clear();
    expect(authLogin('tony0905@gmail.com', 'Tony0905')).toStrictEqual(400);
    clear();
  });
});

describe('Testing search function failed', () => {
  test('Test invalid string length and invalid token', () => {
    const person1 = authRegister('tony0905@gmail.com', 'Tony0905', 'Tony', 'Yeung');
    expect(search(person1.token, '')).toStrictEqual(400);
    let longStr = '';
    while (longStr.length < 1001) {
      longStr += 'ABSBDOUBQwuihdbnquwndoqihdq';
    }
    expect(search(person1.token, longStr)).toStrictEqual(400);
    authLogout(person1.token);
    expect(search(person1.token, 'hiii')).toStrictEqual(403);
  });
});

describe('Testing search function success', () => {
  test('Test success', () => {
    clear();
    const globalOwnerId = authRegister('foo@bar.com', 'password', 'James', 'Charles');
    const tester = authRegister('chocolate@bar.com', 'g00dpassword', 'Willy', 'Wonka');

    const dm1 = dmCreate(tester.token, [globalOwnerId.authUserId]);
    const channel1 = channelsCreate(tester.token, 'search testing', true);
    channelInvite(tester.token, channel1.channelId, globalOwnerId.authUserId);

    messageSend(globalOwnerId.token, channel1.channelId, 'hello!');
    messageSend(globalOwnerId.token, channel1.channelId, 'hello hello!');
    messageSend(globalOwnerId.token, channel1.channelId, 'byebye');
    messageSend(globalOwnerId.token, channel1.channelId, 'hel lo');

    messageSend(tester.token, channel1.channelId, 'hello hello!');
    messageSend(tester.token, channel1.channelId, 'hel lo');

    messageSendDm(globalOwnerId.token, dm1.dmId, 'hello!');
    messageSendDm(globalOwnerId.token, dm1.dmId, 'hello! hihi ');
    messageSendDm(globalOwnerId.token, dm1.dmId, 'bye');

    messageSendDm(tester.token, dm1.dmId, 'hello!');
    messageSendDm(tester.token, dm1.dmId, 'hello! hihi ');
    messageSendDm(tester.token, dm1.dmId, 'bye');

    function expectedMessages(times: number) {
      const expectedMessage = {
        messageId: expect.any(Number),
        uId: globalOwnerId.authUserId,
        message: expect.stringContaining('hello'),
        timeSent: expect.any(Number),
        reacts: expect.any(),
        isPinned: false,
      };
      const expectedList = {
        messages: []
      };
      
      for (const i = 0 ; i < times ; i++) {
        expectedList.messages.push(expectedMessage);
      }

      return expectedList;
    }

    expect(search(globalOwnerId.token, 'hello')).toStrictEqual(expectedMessages(4));
    expect(search(globalOwnerId.token, 'hel')).toStrictEqual(expectedMessages(5));
    expect(search(tester.token, 'hello')).toStrictEqual(expectedMessages(3));
  });
});