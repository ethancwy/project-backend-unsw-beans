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
    const channel1 = channelsCreate(tester.token, 'testingTagging', true);
    channelInvite(tester.token, channel1.channelId, globalOwnerId.authUserId);

    messageSendDm(globalOwnerId.token, dm1.dmId, 'hi @willywonka, ityttmom');
    messageSend(globalOwnerId.token, channel1.channelId, '@willywonka@jamescharles hello!');
  });
});