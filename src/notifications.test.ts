import {
  authRegister, channelsCreate, channelInvite, dmCreate,
  clear, getNotifications, messageReact,
  messageSend, messageSendDm
} from './global';

const REACT = 1;

// tagged: "{User’s handle} tagged you in {channel/DM name}: {first 20 characters of the message}"
// reacted message: "{User’s handle} reacted to your message in {channel/DM name}"
// added to a channel / DM: "{User’s handle} added you to {channel/DM name}"

clear();
// Tests for /notifications/get/v1
describe('/notifications/get/v1 added to channel/dm', () => {
  test('Returns multiple notifications in correct order (channel invite)', () => {
    clear();
    const globalOwnerId = authRegister('foo@bar.com', 'password', 'James', 'Charles');
    const channelOwner1 = authRegister('chocolate@bar.com', 'g00dpassword', 'Willy', 'Wonka');
    const channelOwner2 = authRegister('fruit@bar.com', 'okpassword', 'Billy', 'Bonka');
    const channelOwner3 = authRegister('chicken@bar.com', 'badpassword', 'Tilly', 'Tonka');

    const channel1 = channelsCreate(channelOwner1.token, 'testingNotifs1', true);
    const channel2 = channelsCreate(channelOwner2.token, 'testingNotifs2', false);
    const channel3 = channelsCreate(channelOwner3.token, 'testingNotifs3', true);

    channelInvite(channelOwner1.token, channel1.channelId, globalOwnerId.token);
    channelInvite(channelOwner1.token, channel1.channelId, globalOwnerId.token);
    channelInvite(channelOwner1.token, channel1.channelId, globalOwnerId.token);
    expect(getNotifications(globalOwnerId.token)).toStrictEqual({
      notifications: [
        {
          channelId: channel3.channelId,
          dmId: -1,
          notificationMessage: 'tillytonka added you to testingNotifs3'
        },
        {
          channelId: channel2.channelId,
          dmId: -1,
          notificationMessage: 'billybonka added you to testingNotifs2'
        },
        {
          channelId: channel1.channelId,
          dmId: -1,
          notificationMessage: 'willywonka added you to testingNotifs1'
        },
      ]
    });
  });

  test('Returns multiple notifications in correct order (dm invite)', () => {
    clear();
    const globalOwnerId = authRegister('foo@bar.com', 'password', 'James', 'Charles');
    const dmOwner1 = authRegister('chocolate@bar.com', 'g00dpassword', 'Willy', 'Wonka');
    const dmOwner2 = authRegister('fruit@bar.com', 'okpassword', 'Billy', 'Bonka');
    const dmOwner3 = authRegister('chicken@bar.com', 'badpassword', 'Tilly', 'Tonka');

    const dm1 = dmCreate(dmOwner1.token, [globalOwnerId.authUserId]);
    const dm2 = dmCreate(dmOwner2.token, [globalOwnerId.authUserId]);
    const dm3 = dmCreate(dmOwner3.token, [globalOwnerId.authUserId]);

    expect(getNotifications(globalOwnerId.token)).toStrictEqual({
      notifications: [
        {
          channelId: -1,
          dmId: dm3.dmId,
          notificationMessage: 'tillytonka added you to jamescharles, tillytonka'
        },
        {
          channelId: -1,
          dmId: dm2.dmId,
          notificationMessage: 'billybonka added you to billybonka, jamescharles'
        },
        {
          channelId: -1,
          dmId: dm1.dmId,
          notificationMessage: 'willywonka added you to jamescharles, willywonka'
        },
      ]
    });
  });

  test('Returns multiple notifications in correct order (channel AND dm invite)', () => {
    // dm, channel, dm, channel
    clear();
    const globalOwnerId = authRegister('foo@bar.com', 'password', 'James', 'Charles');
    const tester1 = authRegister('chocolate@bar.com', 'g00dpassword', 'Willy', 'Wonka');
    const tester2 = authRegister('fruit@bar.com', 'okpassword', 'Billy', 'Bonka');

    const dm1 = dmCreate(tester1.token, [globalOwnerId.authUserId]);
    const channel1 = channelsCreate(tester1.token, 'testingNotifs1', true);
    const dm2 = dmCreate(tester2.token, [globalOwnerId.authUserId]);
    const channel2 = channelsCreate(tester2.token, 'testingNotifs2', false);

    expect(getNotifications(globalOwnerId.token)).toStrictEqual({
      notifications: [
        {
          channelId: channel2.channelId,
          dmId: -1,
          notificationMessage: 'billybonka added you to testingNotifs2'
        },
        {
          channelId: -1,
          dmId: dm2.dmId,
          notificationMessage: 'billybonka added you to billybonka, jamescharles'
        },
        {
          channelId: channel1.channelId,
          dmId: -1,
          notificationMessage: 'willywonka added you to testingNotifs1'
        },
        {
          channelId: -1,
          dmId: dm1.dmId,
          notificationMessage: 'willywonka added you to jamescharles, willywonka'
        },
      ]
    });
  });
});

describe('/notifications/get/v1 reacted message', () => {
  test('React message in DM and channel', () => {
    clear();
    const globalOwnerId = authRegister('foo@bar.com', 'password', 'James', 'Charles');
    const tester1 = authRegister('chocolate@bar.com', 'g00dpassword', 'Willy', 'Wonka');

    const dm1 = dmCreate(tester1.token, [globalOwnerId.authUserId]);
    const channel1 = channelsCreate(tester1.token, 'testingReacts', true);

    // globalOwner sends a message to channel and DM
    const dmMessage = messageSendDm(globalOwnerId.token, dm1.dmId, 'hi');
    const channelMessage = messageSend(globalOwnerId.token, channel1.channelId, 'hi again');

    // tester reacts
    messageReact(tester1.token, dmMessage.messageId, REACT);
    messageReact(tester1.token, channelMessage.messageId, REACT);

    expect(getNotifications(globalOwnerId.token)).toStrictEqual({
      notifications: [
        {
          channelId: channel1.channelId,
          dmId: -1,
          notificationMessage: 'willywonka reacted to your message in testingReacts'
        },
        {
          channelId: -1,
          dmId: dm1.dmId,
          notificationMessage: 'willywonka reacted to your message in jamescharles, willywonka'
        },
      ]
    });
  });
});

describe('/notifications/get/v1 tagging', () => {
  test('Tagging in channel and DM', () => {
    clear();
    const globalOwnerId = authRegister('foo@bar.com', 'password', 'James', 'Charles');
    const tester = authRegister('chocolate@bar.com', 'g00dpassword', 'Willy', 'Wonka');

    const dm1 = dmCreate(tester.token, [globalOwnerId.authUserId]);
    const channel1 = channelsCreate(tester.token, 'testingTagging', true);

    // globalOwner tags tester, and himself, testing with 20+ characters
    messageSendDm(globalOwnerId.token, dm1.dmId, 'hi @willywonka, ityttmom');
    messageSend(globalOwnerId.token, channel1.channelId, '@willywonka@jamescharles hello!');

    // 2 notifs test
    expect(getNotifications(tester.token)).toStrictEqual({
      notifications: [
        {
          channelId: channel1.channelId,
          dmId: -1,
          notificationMessage: 'jamescharles tagged you in testingTagging: hi @willywonka, ityt'
        },
        {
          channelId: -1,
          dmId: dm1.dmId,
          notificationMessage: 'jamescharles tagged you in jamescharles, willywonka: @willywonka@jamescha'
        },
      ]
    });

    expect(getNotifications(globalOwnerId.token)).toStrictEqual({
      notifications: [
        {
          channelId: channel1.channelId,
          dmId: -1,
          notificationMessage: 'jamescharles tagged you in jamescharles, willywonka: @willywonka@jamescha'
        },
      ]
    });
  });
});
