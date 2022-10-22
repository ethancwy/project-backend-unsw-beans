import { messageSend, messageEdit, messageRemove, clear, dmCreate, channelJoin } from './global';
import { authRegister, authLogout } from './global';
import { channelsCreate } from './global';
import { messageSendDm } from './global';

// Testing for message/send/v1
describe('Testing  errors for /message/send/v1', () => {
  test('Testing channel id does not refer to valid id', () => {
    clear();
    const auth = authRegister('Nina0803@icloud.com', 'Nina0803', 'Nina', 'Yeh');
    const token = auth.token;
    channelsCreate(token, 'Dog Channel', true);
    const check = messageSend(token, -10, 'helloo');
    expect(check).toStrictEqual({ error: 'error' });
  });

  test('Testing length of message - length = 0', () => {
    clear();
    const auth = authRegister('wateryeung0805@gmail.com', 'waterYYds1', 'Water', 'Yeung');
    const token = auth.token;
    const channelId = channelsCreate(token, 'Water is smart', true);
    const check = messageSend(token, channelId.channelId, '');
    expect(check).toStrictEqual({ error: 'error' });
  });

  test('Testing length of message - length > 1000', () => {
    clear();
    const auth = authRegister('wateryeung0805@gmail.com', 'waterYYds1', 'Water', 'Yeung');
    const token = auth.token;
    const channelId = channelsCreate(token, 'Water is smart', true);
    const check = messageSend(token, channelId.channelId, 'aaaaaaaaaaaakkkkkkkkkkkkkkkdddddddddddddddllllllwkmkmkmskmlkmlkmlkmlkmlkmlkmcyguygjhjhhjhbjhbjhbjhbdmneiejidjicjdjiejdiejdjeijijjfcnjnjnjnxkjnkjnkjsnwdjjjjjjjjjjjjjjjjj22222222222222222222000000000000000000000000000sssssssssssssssssssssssssssssss999999999999999999922222222222222222222lllllllllllllllllllllllllsssssssssssssssssjkjkjkjeeelldoodjjcncnncncncncnnjjdjdjdkjkjkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk00000000000000000000000000000000000000000000ddddddddddddddddddddddddddd44444444444444444444444444433333333333333333333333333333333333333333333333333333ddddddddddddddddddddddddddddddddddddddddddddggggggggggggggggggggggggggggggaaaaaaaaaaaakkkkkkkkkkkkkkkdddddddddddddddllllllwkmkmkmskmlkmlkmlkmlkmlkmlkmcyguygjhjhhjhbjhbjhbjhbdmneiejidjicjdjiejdiejdjeijijjfcnjnjnjnxkjnkjnkjsnwdjjjjjjjjjjjjjjjjj22222222222222222222000000000000000000000000000sssssssssssssssssssssssssssssss999999999999999999922222222222222222222lllllllllllllllllllllllllsssssssssssssssssjkjkjkjeeelldoodjjcncnncncncncnnjjdjdjdkjkjkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk00000000000000000000000000000000000000000000ddddddddddddddddddddddddddd44444444444444444444444444433333333333333333333333333333333333333333333333333333ddddddddddddddddddddddddddddddddddddddddddddgggggggggggggggggggggg');
    expect(check).toStrictEqual({ error: 'error' });
  });

  test('Testing user is not a member of the valid channel ', () => {
    clear();
    const auth1 = authRegister('Henryyeung@gmail.com', 'TurtleCute1', 'Henry', 'Yeung');
    const auth2 = authRegister('Niki@gmail.com', 'breadYum2', 'Niki', 'Huang');
    const token1 = auth1.token;
    const token2 = auth2.token;
    const channelId = channelsCreate(token1, 'turtle live show', true);
    const check = messageSend(token2, channelId.channelId, 'leijou');
    expect(check).toStrictEqual({ error: 'error' });
  });

  test('Testing invalid token', () => {
    clear();
    const auth = authRegister('Tonyyeung0905@gmail.com', 'HKnumber1', 'Tony', 'Yeung');
    const token = auth.token;
    const channelId = channelsCreate(token, 'hk channel', true);
    authLogout(token);
    const check = messageSend(token, channelId.channelId, 'wow');
    expect(check).toStrictEqual({ error: 'error' });
  });

  test('Testing user is not a member of the valid channel - success statment', () => {
    clear();
    const auth1 = authRegister('Henryyeung@gmail.com', 'TurtleCute1', 'Henry', 'Yeung');
    const token1 = auth1.token;
    const channelId = channelsCreate(token1, 'turtle', true);
    const check = messageSend(token1, channelId.channelId, 'leijou');
    expect(check).toStrictEqual({ messageId: expect.any(Number) });
  });
});

// Testing for message/edit/v1
describe('/message/edit/v1', () => {
  test('Testing length of message - length > 1000', () => {
    clear();
    const auth = authRegister('wateryeung0805@gmail.com', 'waterYYds1', 'Water', 'Yeung');
    const token = auth.token;
    const channelId = channelsCreate(token, 'Waterrr', true);
    const messageId = messageSend(token, channelId.channelId, 'happy');
    const check = messageEdit(token, messageId.messageId, 'aaafffaaeeakkkkeeekkkkeekkkkkkkdddddddddddddddllllllwkmkmkmskmlkmlkmlkmlkmlkmlkmcyguygjhjhhjhbjhbjhbjhbdmneiejidjicjdjiejdiejdjeijijjfcnjnjnjnxkjnkjnkjsnwdjjjjjjjjjjjjjjjjj22222222222222222222000000000000000000000000000sssssssssssssssssssssssssssssss999999999999999999922222222222222222222lllllllllllllllllllllllllsssssssssssssssssjkjkjkjeeelldoodjjcncnncncncncnnjjdjdjdkjkjkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk00000000000000000000000000000000000000000000ddddddddddddddddddddddddddd44444444444444444444444444433333333333333333333333333333333333333333333333333333ddddddddddddddddddddddddddddddddddddddddddddggggggggggggggggggggggggggggggaaaaaaaaaaaakkkkkkkkkkkkkkkdddddddddddddddllllllwkmkmkmskmlkmlkmlkmlkmlkmlkmcyguygjhjhhjhbjhbjhbjhbdmneiejidjicjdjiejdiejdjeijijjfcnjnjnjnxkjnkjnkjsnwdjjjjjjjjjjjjjjjjj22222222222222222222000000000000000000000000000sssssssssssssssssssssssssssssss999999999999999999922222222222222222222lllllllllllllllllllllllllsssssssssssssssssjkjkjkjeeelldoodjjcncnncncncncnnjjdjdjdkjkjkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk00000000000000000000000000000000000000000000ddddddddddddddddddddddddddd44444444444444444444444444433333333333333333333333333333333333333333333333333333ddddddddddddddddddddddddddddddddddddddddddddgggggggggggggggggggggg');
    expect(check).toStrictEqual({ error: 'error' });
  });

  test('Testing messageId does not sent by the authorised user making the request', () => {
    clear();
    const auth1 = authRegister('Tonyyeung0905@gmail.com', 'HKnumber1', 'Tony', 'Yeung');
    const auth2 = authRegister('Peter@gmail.com', 'drink1234', 'Peter', 'He');
    const token1 = auth1.token;
    const token2 = auth2.token;
    const channelId = channelsCreate(token1, 'hk channel', true);
    const messageId = messageSend(token1, channelId.channelId, 'great');
    const check = messageEdit(token2, messageId.messageId + 1, '');
    expect(check).toStrictEqual({ error: 'error' });
  });

  test('Testing the authorised user does not have owner permission in the channel', () => {
    clear();
    const auth1 = authRegister('Tonyyeung0905@gmail.com', 'HKnumber1', 'Tony', ' Yeung');
    const auth2 = authRegister('Ericchen@icloud.com', 'Ntu123456', 'Eric', 'Chen');
    const token1 = auth1.token;
    const token2 = auth2.token;
    const dm = dmCreate(token1, [auth2.Id]);
    // get access in to dm id
    const dmMessage = messageSendDm(token1, dm.dmId, 'hehehe');
    const check1 = messageEdit(token2, dmMessage.messageId, '');
    expect(check1).toStrictEqual({ error: 'error' });
    const channelId = channelsCreate(token1, 'cat channel', true);
    const messageId = messageSend(token1, channelId.channelId, 'Hi');
    const check2 = messageEdit(token2, messageId.messageId, '');
    expect(check2).toStrictEqual({ error: 'error' });
  });

  test('Testing invalid token', () => {
    clear();
    const auth = authRegister('Tonyyeung0905@gmail.com', 'HKnumber1', ' Tony', 'Yeung');
    const token = auth.token;
    const channelId = channelsCreate(token, 'hk channel', true);
    const messageId = messageSend(token, channelId.channelId, 'Meow');
    authLogout(token);
    const check = messageEdit(token, messageId.messageId, 'Hi');
    expect(check).toStrictEqual({ error: 'error' });
  });
});

// Testing for message/remove/v1
describe('Testing for /message/remove/v1', () => {
  test('Testing messageId does not refer to valid message within channel/dm that authorised user join', () => {
    clear();
    const auth = authRegister('lala0110@gmail.com', 'lala0110', 'Lala', 'Yeh');
    const token = auth.token;
    const channelId = channelsCreate(token, 'eat channel', true);
    const message = messageSend(token, channelId.channelId, 'bark');
    const check = messageRemove(token, message.messageId + 1);
    expect(check).toStrictEqual({ error: 'error' });
  });

  test('Testing message was not send by authorised user making the request', () => {
    clear();
    const auth1 = authRegister('Tonyyeung0905@gmail.com', 'HKnumber1', 'Tony', 'Yeung');
    const auth2 = authRegister('Ericchen@icloud.com', 'Ntu123456', 'Eric', 'Chen');
    const token1 = auth1.token;
    const token2 = auth2.token;
    const channelId = channelsCreate(token1, 'channel', true);
    const message = messageSend(token1, channelId.channelId, 'ntu band');
    const check = messageRemove(token2, message.messageId);
    expect(check).toStrictEqual({ error: 'error' });
  });

  test('Testing the authorised user does not have owner permission', () => {
    clear();
    const auth1 = authRegister('Tonyyeung0905@gmail.com', 'HKnumber1', 'Tony', 'Yeung');
    const auth2 = authRegister('Ericchen@icloud.com', 'Ntu123456', 'Eric', 'Chen');
    const token1 = auth1.token;
    const token2 = auth2.token;
    const dm = dmCreate(token1, [auth2.authUserId]);
    const dmMessage = messageSendDm(token1, dm.dmId, 'lol');
    const check1 = messageRemove(token2, dmMessage.messageId);
    expect(check1).toStrictEqual({ error: 'error' });
    const channelId = channelsCreate(token1, 'couple channel', true);
    channelJoin(token2, channelId.channelId);
    const channelMessage = messageSend(token1, channelId.channelId, 'hahaha');
    const check2 = messageRemove(token2, channelMessage.messageId);
    expect(check2).toStrictEqual({ error: 'error' });
  });

  test(' Testing invalid token', () => {
    clear();
    const auth = authRegister('Tonyyeung0905@gmail.com', 'HKnumber1', 'Tony', 'Yeung');
    const token = auth.token;
    const channelId = channelsCreate(token, 'icl channel', true);
    const message = messageSend(token, channelId.channelId, 'nice');
    authLogout(token);
    const check = messageRemove(token, message.messageId);
    expect(check).toStrictEqual({ error: 'error' });
  });
});

describe('Testing success for removing', () => {
  test('removing test1', () => {
    clear();
    const auth = authRegister('Tonyyeung0905@gmail.com', 'HKnumber1', 'Tony', 'Yeung');
    const token = auth.token;
    const channelId = channelsCreate(token, 'icl channel', true);
    const message = messageSend(token, channelId.channelId, 'nice');
    const check = messageRemove(token, message.messageId);
    expect(check).toStrictEqual({});
  });

  test('removing test2', () => {
    clear();
    const auth1 = authRegister('Tonyyeung0905@gmail.com', 'HKnumber1', 'Tony', 'Yeung');
    const auth2 = authRegister('Ericchen@icloud.com', 'Ntu123456', 'Eric', 'Chen');
    const token1 = auth1.token;
    const token2 = auth2.token;
    const dm = dmCreate(token1, [auth2.authUserId]);
    const message = messageSendDm(token2, dm.dmId, 'nice');
    const check = messageRemove(token1, message.messageId);
    expect(check).toStrictEqual({});
  });
});

// Testing for message/senddm/v1
describe('Testing message/senddm/v1', () => {
  test('Testing dmld does not refer to a valid DM', () => {
    clear();
    const auth1 = authRegister('Tonyyeung0905@gmail.com', 'HKnumber1', 'Tony', 'Yeung');
    const auth2 = authRegister('Ericchen@icloud.com', 'Ntu123456', 'Eric', 'Chen');
    const auth3 = authRegister('Roywu@gmail.com', 'Sanfransisco3', 'Roy', 'Wu');
    const auth4 = authRegister('ray@icloud.com', 'gainWeight4', 'Ray', 'Chiu');
    const token = auth1.token;
    const dm = dmCreate(token, [auth2.authUserId, auth3.authUserId, auth4.authUserId]);
    const check = messageSendDm(token, dm.dmId + 1, 'meow');
    expect(check).toStrictEqual({ error: 'error' });
  });

  test('Testing length of message is less than 1', () => {
    clear();
    const auth1 = authRegister('Tonyyeung0905@gmail.com', 'HKnumber1', 'Tony', 'Yeung');
    const auth2 = authRegister('Ericchen@icloud.com', 'Ntu123456', 'Eric', 'Chen');
    const auth3 = authRegister('Roywu@gmail.com', 'Sanfransisco3', 'Roy', 'Wu');
    const auth4 = authRegister('ray@icloud.com', 'gainWeight4', 'Ray', 'Chiu');
    const token = auth1.token;
    const dm = dmCreate(token, [auth2.authUserId, auth3.authUserId, auth4.authUserId]);
    const check = messageSendDm(token, dm.dmId, '');
    expect(check).toStrictEqual({ error: 'error' });
  });

  test('Testing length of message is over 1000', () => {
    clear();
    const auth1 = authRegister('Tonyyeung0905@gmail.com', 'HKnumber1', 'Tony', 'Yeung');
    const auth2 = authRegister('Ericchen@icloud.com', 'Ntu123456', 'Eric', 'Chen');
    const auth3 = authRegister('Roywu@gmail.com', 'Sanfransisco3', 'Roy', 'Wu');
    const auth4 = authRegister('ray@icloud.com', 'gainWeight4', 'Ray', 'Chiu');
    const token = auth1.token;
    const dm = dmCreate(token, [auth2.authUserId, auth3.authUserId, auth4.authUserId]);
    const check = messageSendDm(token, dm.dmId, 'aaafffaaeeakkkkeeekkkkeekkkkkkkdddddddddddddddllllllwkmkmkmskmlkmlkmlkmlkmlkmlkmcyguygjhjhhjhbjhbjhbjhbdmneiejidjicjdjiejdiejdjeijijjfcnjnjnjnxkjnkjnkjsnwdjjjjjjjjjjjjjjjjj22222222222222222222000000000000000000000000000sssssssssssssssssssssssssssssss999999999999999999922222222222222222222lllllllllllllllllllllllllsssssssssssssssssjkjkjkjeeelldoodjjcncnncncncncnnjjdjdjdkjkjkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk00000000000000000000000000000000000000000000ddddddddddddddddddddddddddd44444444444444444444444444433333333333333333333333333333333333333333333333333333ddddddddddddddddddddddddddddddddddddddddddddggggggggggggggggggggggggggggggaaaaaaaaaaaakkkkkkkkkkkkkkkdddddddddddddddllllllwkmkmkmskmlkmlkmlkmlkmlkmlkmcyguygjhjhhjhbjhbjhbjhbdmneiejidjicjdjiejdiejdjeijijjfcnjnjnjnxkjnkjnkjsnwdjjjjjjjjjjjjjjjjj22222222222222222222000000000000000000000000000sssssssssssssssssssssssssssssss999999999999999999922222222222222222222lllllllllllllllllllllllllsssssssssssssssssjkjkjkjeeelldoodjjcncnncncncncnnjjdjdjdkjkjkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk00000000000000000000000000000000000000000000ddddddddddddddddddddddddddd44444444444444444444444444433333333333333333333333333333333333333333333333333333ddddddddddddddddddddddddddddddddddddddddddddggggggggggggggggggggg');
    expect(check).toStrictEqual({ error: 'error' });
  });

  test('Testing dmld is valid and the authorised user is not a member of dm', () => {
    clear();
    const auth1 = authRegister('Tonyyeung0905@gmail.com', 'HKnumber1', 'Tony', 'Yeung');
    const auth2 = authRegister('Ericchen@icloud.com', 'Ntu123456', 'Eric', 'Chen');
    const auth3 = authRegister('Roywu@gmail.com', 'Sanfransisco3', 'Roy', 'Wu');
    const auth4 = authRegister('ray@icloud.com', 'gainWeight4', 'Ray', 'Chiu');
    const token1 = auth1.token;
    const token2 = auth2.token;
    const dm = dmCreate(token1, [auth3.authUserId, auth4.authUserId]);
    const check = messageSendDm(token2, dm.dmId, 'meow');
    expect(check).toStrictEqual({ error: 'error' });
  });

  test('Testing invalid token', () => {
    clear();
    const auth1 = authRegister('Tonyyeung0905@gmail.com', 'HKnumber1', 'Tony', 'Yeung');
    const auth2 = authRegister('Ericchen@icloud.com', 'Ntu123456', 'Eric', 'Chen');
    const auth3 = authRegister('Roywu@gmail.com', 'Sanfransisco3', 'Roy', 'Wu');
    const auth4 = authRegister('ray@icloud.com', 'gainWeight4', 'Ray', 'Chiu');
    const token = auth1.token;
    const dmId = dmCreate(token, [auth2.authUserId, auth3.authUserId, auth4.authUserId]);
    authLogout(token);
    const check = messageSendDm(token, dmId.dmId, 'meow');
    expect(check).toStrictEqual({ error: 'error' });
  });

  test('success statement', () => {
    clear();
    const auth1 = authRegister('Tonyyeung0905@gmail.com', 'HKnumber1', 'Tony', 'Yeung');
    const auth2 = authRegister('Ericchen@icloud.com', 'Ntu123456', 'Eric', 'Chen');
    const auth3 = authRegister('Roywu@gmail.com', 'Sanfransisco3', 'Roy', 'Wu');
    const auth4 = authRegister('ray@icloud.com', 'gainWeight4', 'Ray', 'Chiu');
    const token = auth1.token;
    const token2 = auth2.token;
    const dmId = dmCreate(token, [auth2.authUserId, auth3.authUserId, auth4.authUserId]);
    const message1 = messageSendDm(token, dmId.dmId, 'meow');
    const message2 = messageSendDm(token2, dmId.dmId, 'meow');
    expect(message1).toStrictEqual({ messageId: 0 });
    expect(message2).toStrictEqual({ messageId: 1 });
  });
});
