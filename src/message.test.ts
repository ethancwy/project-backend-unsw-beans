import {
  messageSend, messageEdit, messageRemove, clear, dmCreate, dmMessages, channelMessages, channelJoin
} from './global';
import { authRegister, authLogout } from './global';
import { channelsCreate } from './global';
import { messageSendDm } from './global';

clear();
// Testing for message/send/v1
describe('/message/send/v1 success', () => {
  test('Successful message send to channel', () => {
    clear();
    const auth = authRegister('Nina0803@icloud.com', 'Nina0803', 'Nina', 'Yeh');
    const channelId = channelsCreate(auth.token, 'Dog Channel', true);
    const messageId1 = messageSend(auth.token, channelId.channelId, 'helloo');
    const messageId2 = messageSend(auth.token, channelId.channelId, 'there');
    expect(channelMessages(auth.token, channelId.channelId, 0)).toStrictEqual({
      messages: [
        {
          messageId: messageId1.messageId,
          uId: auth.authUserId,
          message: 'helloo',
          timeSent: expect.any(Number),
        },
        {
          messageId: messageId2.messageId,
          uId: auth.authUserId,
          message: 'there',
          timeSent: expect.any(Number),
        }
      ],
      start: 0,
      end: -1,
    });
  });
});

describe('Testing errors for /message/send/v1', () => {
  test('Invalid channel', () => {
    clear();
    const auth = authRegister('Nina0803@icloud.com', 'Nina0803', 'Nina', 'Yeh');
    const token = auth.token;
    const channelId = channelsCreate(token, 'Dog Channel', true);
    const invalidChannelId = channelId + 1;
    const check = messageSend(token, invalidChannelId, 'helloo');
    expect(check).toStrictEqual({ error: 'error' });
  });

  test('Testing length of message - length = 0', () => {
    clear();
    const auth = authRegister('wateryeung0805@gmail.com', 'waterYYds1', 'Water', 'Yeung');
    const channelId = channelsCreate(auth.token, 'Water is smart', true);

    expect(messageSend(auth.token, channelId.channelId, '')).toStrictEqual({ error: 'error' });
  });

  test('Testing length of message - length > 1000', () => {
    clear();
    const auth = authRegister('wateryeung0805@gmail.com', 'waterYYds1', 'Water', 'Yeung');
    const token = auth.token;
    const channelId = channelsCreate(token, 'Water is smart', true);

    const invalidMessage = [];
    for ( let i = 0 ; i < 1005 ; i++ ) {
      invalidMessage.push('1');
    }
    const check = messageSend(token, channelId.channelId, invalidMessage.toString());
    expect(check).toStrictEqual({ error: 'error' });
  });

  test('Testing user is not a member of the valid channel ', () => {
    clear();
    const auth1 = authRegister('Henryyeung@gmail.com', 'TurtleCute1', 'Henry', 'Yeung');
    const auth2 = authRegister('Niki@gmail.com', 'breadYum2', 'Niki', 'Huang');

    const channelId = channelsCreate(auth1.token, 'turtle live show', true);
    expect(messageSend(auth2.token, channelId.channelId, 'leijou')).toStrictEqual({ error: 'error' });
  });

  test('Testing invalid token', () => {
    clear();
    const auth = authRegister('Tonyyeung0905@gmail.com', 'HKnumber1', 'Tony', 'Yeung');
    const token = auth.token;
    const channelId = channelsCreate(token, 'hk channel', true);

    authLogout(token);
    expect(messageSend(token, channelId.channelId, 'wow')).toStrictEqual({ error: 'error' });
  });
});

// Testing for message/senddm/v1
describe('message/senddm/v1 success', () => {
  test('success statement', () => {
    clear();
    const auth1 = authRegister('Tonyyeung0905@gmail.com', 'HKnumber1', 'Tony', 'Yeung');
    const auth2 = authRegister('Ericchen@icloud.com', 'Ntu123456', 'Eric', 'Chen');

    const dmId = dmCreate(auth1.token, [auth2.authUserId]);
    const message1 = messageSendDm(auth1.token, dmId.dmId, 'meow1');
    const message2 = messageSendDm(auth2.token, dmId.dmId, 'meow2');
    expect(message1).toStrictEqual({ messageId: expect.any(Number) });
    expect(message2).toStrictEqual({ messageId: expect.any(Number) });
    expect(dmMessages(auth1.token, dmId.dmId, 0)).toStrictEqual({
      messages: [
        {
          messageId: message1.messageId,
          uId: auth1.authUserId,
          message: 'meow1',
          timeSent: expect.any(Number),
        },
        {
          messageId: message2.messageId,
          uId: auth2.authUserId,
          message: 'meow2',
          timeSent: expect.any(Number),
        }
      ],
      start: 0,
      end: -1,
    });
  });
});

describe('Error checking message/senddm/v1', () => {
  test('Testing dmId does not refer to a valid DM', () => {
    clear();
    const auth = authRegister('Tonyyeung0905@gmail.com', 'HKnumber1', 'Tony', 'Yeung');
    const dm = dmCreate(auth.token, []);
    const invalidDmId = dm.dmId + 1;
    expect(messageSendDm(auth.token, invalidDmId, 'meow')).toStrictEqual({ error: 'error' });
  });

  test('Testing length of message is over 1000 char', () => {
    clear();
    const auth = authRegister('Tonyyeung0905@gmail.com', 'HKnumber1', 'Tony', 'Yeung');
    const dm = dmCreate(auth.token, []);

    const invalidMessage = [];
    for ( let i = 0 ; i < 1005 ; i++ ) {
      invalidMessage.push('1');
    }
    const check = messageSendDm(auth.token, dm.dmId, invalidMessage.toString());
    expect(check).toStrictEqual({ error: 'error' });
  });

  test('Testing length of message is less than 1 char', () => {
    clear();
    const auth = authRegister('Tonyyeung0905@gmail.com', 'HKnumber1', 'Tony', 'Yeung');
    const dm = dmCreate(auth.token, []);
    expect(messageSendDm(auth.token, dm.dmId, '')).toStrictEqual({ error: 'error' });
  });

  test('Testing dmld is valid and non member tries to post', () => {
    clear();
    const auth1 = authRegister('Tonyyeung0905@gmail.com', 'HKnumber1', 'Tony', 'Yeung');
    const auth2 = authRegister('Ericchen@icloud.com', 'Ntu123456', 'Eric', 'Chen');
    const auth3 = authRegister('Roywu@gmail.com', 'Sanfransisco3', 'Roy', 'Wu');
    const auth4 = authRegister('ray@icloud.com', 'gainWeight4', 'Ray', 'Chiu');

    const dm = dmCreate(auth1.token, [auth3.authUserId, auth4.authUserId]);
    expect(messageSendDm(auth2.token, dm.dmId, 'meow')).toStrictEqual({ error: 'error' });
  });

  test('Testing invalid token', () => {
    clear();
    const auth = authRegister('Tonyyeung0905@gmail.com', 'HKnumber1', 'Tony', 'Yeung');
    const dm = dmCreate(auth.token, []);
    const invalidToken = auth.token + 'wassup';
    expect(messageSendDm(invalidToken, dm.dmId, 'meow')).toStrictEqual({ error: 'error' });
  });
});

// Testing for message/edit/v1
describe('/message/edit/v1 success', () => {
  test('Successful message edit in CHANNEL', () => {
    clear();
    const auth = authRegister('Nina0803@icloud.com', 'Nina0803', 'Nina', 'Yeh');
    const channelId = channelsCreate(auth.token, 'Dog Channel', true);
    const messageId = messageSend(auth.token, channelId.channelId, 'helloo');
    const newMsg = messageEdit(auth.token, messageId.messageId, 'edited!');
    expect(newMsg).toStrictEqual({});
    expect(channelMessages(auth.token, channelId.channelId, 0)).toStrictEqual({
      messages: [
        {
          messageId: messageId.messageId,
          uId: auth.authUserId,
          message: 'edited!',
          timeSent: expect.any(Number),
        }
      ],
      start: 0,
      end: -1,
    });
  });

  test('Successful message edit in DM', () => {
    clear();
    const auth = authRegister('Nina0803@icloud.com', 'Nina0803', 'Nina', 'Yeh');
    const dm = dmCreate(auth.token, []);
    const messageId = messageSendDm(auth.token, dm.dmId, 'helloo');
    expect(messageEdit(auth.token, messageId.messageId, 'edited!')).toStrictEqual({});
    expect(dmMessages(auth.token, dm.dmId, 0)).toStrictEqual({
      messages: [
        {
          messageId: messageId.messageId,
          uId: auth.authUserId,
          message: 'edited!',
          timeSent: expect.any(Number),
        }
      ],
      start: 0,
      end: -1,
    });
  });
});

describe('Testing errors for /message/edit/v1', () => {
  test('Testing length of message - length > 1000', () => {
    clear();
    const auth = authRegister('wateryeung0805@gmail.com', 'waterYYds1', 'Water', 'Yeung');
    const token = auth.token;
    const channelId = channelsCreate(token, 'Waterrr', true);
    const messageId = messageSend(token, channelId.channelId, 'happy');
    const invalidMessage = [];
    for ( let i = 0 ; i < 1005 ; i++ ) {
      invalidMessage.push('1');
    }
    const check = messageEdit(token, messageId.messageId, invalidMessage.toString());
    expect(check).toStrictEqual({ error: 'error' });
  });

  test('Global owner cannot edit member message in DM', () => {
    clear();
    const globalOwner = authRegister('Tonyyeung0905@gmail.com', 'HKnumber1', 'Tony', 'Yeung');
    const dmOwner = authRegister('Jackychan@gmail.com', 'passwordhehe', 'Jacky', 'Chan');
    const member = authRegister('Peter@gmail.com', 'drink1234', 'Peter', 'He');

    const dm = dmCreate(dmOwner.token, [globalOwner.authUserId, member.authUserId]);
    const messageId = messageSendDm(member.token, dm.dmId, 'great');
    expect(messageEdit(globalOwner.token, messageId.messageId, 'edited!')).toStrictEqual({ error: 'error' });
  });

  test('Empty string edit deletes message, cannot edit deleted message', () => {
    clear();
    const globalOwner = authRegister('Tonyyeung0905@gmail.com', 'HKnumber1', 'Tony', 'Yeung');

    const channelId = channelsCreate(globalOwner.token, 'hk channel', true);
    const messageId = messageSend(globalOwner.token, channelId.channelId, 'great');
    // edit empty string (removes message)
    expect(messageEdit(globalOwner.token, messageId.messageId, '')).toStrictEqual({});
    expect(channelMessages(globalOwner.token, channelId.channelId, 0)).toStrictEqual({
      messages: [],
      start: 0,
      end: -1,
    });
    // cannot edit deleted message
    expect(messageEdit(globalOwner.token, messageId.messageId, 'test')).toStrictEqual({ error: 'error' });
  });

  test('Member cannot edit globalOwner message in both channel and dm', () => {
    clear();
    const globalOwner = authRegister('Tonyyeung0905@gmail.com', 'HKnumber1', 'Tony', 'Yeung');
    const channelId = channelsCreate(globalOwner.token, 'hk channel', true);
    const dmOwner = authRegister('Jackychan@gmail.com', 'passwordhehe', 'Jacky', 'Chan');
    const member = authRegister('Peter@gmail.com', 'drink1234', 'Peter', 'He');

    const dm = dmCreate(dmOwner.token, [globalOwner.authUserId, member.authUserId]);
    const messageId = messageSendDm(globalOwner.token, dm.dmId, 'great');
    const channelmessageId = messageSend(globalOwner.token, channelId.channelId, 'great');
    expect(messageEdit(member.token, messageId.messageId, 'edited!')).toStrictEqual({ error: 'error' });
    expect(messageEdit(member.token, channelmessageId.messageId, 'edited!')).toStrictEqual({ error: 'error' });
    channelJoin(member.token, channelId.channelId);
    expect(messageEdit(member.token, channelmessageId.messageId, 'edited!')).toStrictEqual({ error: 'error' });
  });

  test('Testing invalid token', () => {
    clear();
    const auth = authRegister('Tonyyeung0905@gmail.com', 'HKnumber1', ' Tony', 'Yeung');
    const channelId = channelsCreate(auth.token, 'hk channel', true);
    const messageId = messageSend(auth.token, channelId.channelId, 'Meow');

    authLogout(auth.token);
    expect(messageEdit(auth.token, messageId.messageId, 'Hi')).toStrictEqual({ error: 'error' });
  });
});

// Testing for message/remove/v1
describe('message/remove/v1 SUCCESS', () => {
  test('poster removing message from CHANNEL', () => {
    clear();
    const auth = authRegister('Tonyyeung0905@gmail.com', 'HKnumber1', 'Tony', 'Yeung');
    const channelId = channelsCreate(auth.token, 'icl channel', true);
    const message = messageSend(auth.token, channelId.channelId, 'nice');
    expect(messageRemove(auth.token, message.messageId)).toStrictEqual({});
    expect(channelMessages(auth.token, channelId.channelId, 0)).toStrictEqual({
      messages: [],
      start: 0,
      end: -1,
    });
  });

  test('owner removing member message from DM', () => {
    clear();
    const dmOwner = authRegister('Tonyyeung0905@gmail.com', 'HKnumber1', 'Tony', 'Yeung');
    const member = authRegister('Ericchen@icloud.com', 'Ntu123456', 'Eric', 'Chen');

    const dm = dmCreate(dmOwner.token, [member.authUserId]);
    const message = messageSendDm(member.token, dm.dmId, 'remove my message pls');

    expect(messageRemove(dmOwner.token, message.messageId)).toStrictEqual({});
    expect(dmMessages(dmOwner.token, dm.dmId, 0)).toStrictEqual({
      messages: [],
      start: 0,
      end: -1,
    });
  });
});

describe('Error checking /message/remove/v1', () => {
  test('Testing messageId does not refer to valid message within channel/dm that authorised user join', () => {
    clear();
    const auth = authRegister('lala0110@gmail.com', 'lala0110', 'Lala', 'Yeh');
    const channelId = channelsCreate(auth.token, 'eat channel', true);
    const message = messageSend(auth.token, channelId.channelId, 'bark');

    const invalidMessageId = message.messageId + 1;
    expect(messageRemove(auth.token, invalidMessageId)).toStrictEqual({ error: 'error' });
  });

  test('Testing message was not send by authorised user making the request', () => {
    clear();
    const auth1 = authRegister('Tonyyeung0905@gmail.com', 'HKnumber1', 'Tony', 'Yeung');
    const auth2 = authRegister('Ericchen@icloud.com', 'Ntu123456', 'Eric', 'Chen');

    const channelId = channelsCreate(auth1.token, 'channel', true);
    const message = messageSend(auth1.token, channelId.channelId, 'ntu band');
    expect(messageRemove(auth2.token, message.messageId)).toStrictEqual({ error: 'error' });
  });

  test('Global owner (non-owner) cannot remove member message in DM', () => {
    clear();
    const globalOwner = authRegister('Tonyyeung0905@gmail.com', 'HKnumber1', 'Tony', 'Yeung');
    const dmOwner = authRegister('Jackychan@gmail.com', 'passwordhehe', 'Jacky', 'Chan');
    const member = authRegister('Peter@gmail.com', 'drink1234', 'Peter', 'He');

    const dm = dmCreate(dmOwner.token, [globalOwner.authUserId, member.authUserId]);
    const messageId = messageSendDm(member.token, dm.dmId, 'try to remove me');
    expect(messageRemove(globalOwner.token, messageId.messageId)).toStrictEqual({ error: 'error' });
  });

  test('Cannot remove deleted message (via edit to empty string)', () => {
    clear();
    const globalOwner = authRegister('Tonyyeung0905@gmail.com', 'HKnumber1', 'Tony', 'Yeung');

    const channelId = channelsCreate(globalOwner.token, 'hk channel', true);
    const messageId = messageSend(globalOwner.token, channelId.channelId, 'great');
    // edit empty string (removes message)
    expect(messageEdit(globalOwner.token, messageId.messageId, '')).toStrictEqual({});
    // cannot remove deleted message
    expect(messageRemove(globalOwner.token, messageId.messageId)).toStrictEqual({ error: 'error' });
  });

  test('Testing invalid token', () => {
    clear();
    const auth = authRegister('Tonyyeung0905@gmail.com', 'HKnumber1', 'Tony', 'Yeung');
    const channelId = channelsCreate(auth.token, 'icl channel', true);
    const message = messageSend(auth.token, channelId.channelId, 'nice');

    const invalidToken = auth.token + 'yoo';
    expect(messageRemove(invalidToken, message.messageId)).toStrictEqual({ error: 'error' });
    clear();
  });
  
});

