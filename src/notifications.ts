import { getData } from './dataStore';
import { getUserId, isValidToken, isInChannel, isInDm } from './global';
import { getChannelDetails, getDmDetails } from './global';
import { userProfileV3 } from './users';

// import { isValidToken, isValidUser, getUserId, isDmValid, isDmMember } from './global';
import HTTPError from 'http-errors';

type NotifArr = {
  channelId: number;
  dmId: number;
  notificationMessage: string;
  timeCounter: number;
}

function getTaggedNotif(token: string) {
  const data = getData();
  const uId = getUserId(token);
  const arr = [];

  for (const msg of data.messageDetails) {
    for (const tag of msg.tags) {
      if (uId === tag) {
        const tagger = userProfileV3(token, msg.uId);
        const handle = tagger.user.handleStr;
        if (msg.isDm) { // get DM details
          const dm = getDmDetails(msg.listId);
          const message = msg.message;
          const slicedMessage = message.substring(0, 20);
          arr.push({
            channelId: -1,
            dmId: msg.listId,
            notificationMessage: `${handle} tagged you in ${dm.name}: ${slicedMessage}`,
            timeCounter: msg.timeCounter,
          });
        } else { // get channel details
          const channel = getChannelDetails(msg.listId);
          const message = msg.message;
          const slicedMessage = message.substring(0, 20);
          arr.push({
            channelId: msg.listId,
            dmId: -1,
            notificationMessage: `${handle} tagged you in ${channel.name}: ${slicedMessage}`,
            timeCounter: msg.timeCounter,
          });
        }
        break;
      }
    }
  }

  return arr;
}

function getInvitedNotif(token: string, arr: Array<NotifArr>) {
  const data = getData();
  const uId = getUserId(token);

  for (const i of data.inviteDetails) {
    const tagger = userProfileV3(token, i.uId);
    const handle = tagger.user.handleStr;
    if (!i.isDm) {
      if (uId === i.invited) {
        const channel = getChannelDetails(i.listId);
        arr.push({
          channelId: i.listId,
          dmId: -1,
          notificationMessage: `${handle} added you to ${channel.name}`,
          timeCounter: i.timeCounter,
        });
      }
    } else { // is DM, iterate through invited
      for (const j of i.invited) {
        if (uId === j) {
          const dm = getDmDetails(i.listId);
          arr.push({
            channelId: -1,
            dmId: i.listId,
            notificationMessage: `${handle} added you to ${dm.name}`,
            timeCounter: i.timeCounter,
          });
        }
      }
    }
  }

  return arr;
}

function getReactNotif(token: string, arr: Array<NotifArr>) {
  const data = getData();
  const uId = getUserId(token);

  for (const i of data.reactDetails) {
    const reactor = userProfileV3(token, i.authUserId);
    const handle = reactor.user.handleStr;
    if (uId === i.senderId) {
      if (i.isDm) {
        if (isInDm(uId, i.listId)) {
          const dm = getDmDetails(i.listId);
          arr.push({
            channelId: -1,
            dmId: i.listId,
            notificationMessage: `${handle} reacted to your message in ${dm.name}`,
            timeCounter: i.timeCounter,
          });
        }
      } else {
        if (isInChannel(uId, i.listId)) {
          const channel = getChannelDetails(i.listId);
          // console.log(channel);
          arr.push({
            channelId: i.listId,
            dmId: -1,
            notificationMessage: `${handle} reacted to your message in ${channel.name}`,
            timeCounter: i.timeCounter,
          });
        }
      }
    }
  }
  return arr;
}

/**
  * Returns the user's most recent 20 notifications,
  * ordered from most recent to least recent.
  *
  * @param {string} token - a valid token
  *
  * @returns {notifications {channelId: number, dmId: number,
  * notificationMessage: string} } - object notifications
*/
// !check if member is in channel
export function getNotificationsV1(token: string) {
  if (!isValidToken(token)) {
    throw HTTPError(403, 'Invalid token');
  }

  // let arr = getInvitedNotif(token, getTaggedNotif(token));
  const arr = getReactNotif(token, getInvitedNotif(token, getTaggedNotif(token)));
  // console.log(arr);
  // sort arr by latest notif coming first!
  arr.sort((a, b) => b.timeCounter - a.timeCounter);
  // delete not needed key for returning

  for (const i of arr) {
    delete i.timeCounter;
  }

  return {
    notifications: arr
  };
}

// clearV1();
// const globalOwnerId = authRegisterV3('foo@bar.com', 'password', 'James', 'Charles');
// const channelOwner1 = authRegisterV3('chocolate@bar.com', 'g00dpassword', 'Willy', 'Wonka');
// const channelOwner2 = authRegisterV3('fruit@bar.com', 'okpassword', 'Billy', 'Bonka');
// const channelOwner3 = authRegisterV3('chicken@bar.com', 'badpassword', 'Tilly', 'Tonka');

// const channel1 = channelsCreateV3(channelOwner1.token, 'testingNotifs1', true);
// const channel2 = channelsCreateV3(channelOwner2.token, 'testingNotifs2', false);
// const channel3 = channelsCreateV3(channelOwner3.token, 'testingNotifs3', true);

// channelInviteV3(channelOwner1.token, channel1.channelId, globalOwnerId.authUserId);
// channelInviteV3(channelOwner2.token, channel2.channelId, globalOwnerId.authUserId);
// channelInviteV3(channelOwner3.token, channel3.channelId, globalOwnerId.authUserId);
// console.log(getNotificationsV1(globalOwnerId.token));

// const globalOwnerId = authRegisterV3('foo@bar.com', 'password', 'James', 'Charles');
// const tester1 = authRegisterV3('chocolate@bar.com', 'g00dpassword', 'Willy', 'Wonka');
// const tester2 = authRegisterV3('fruit@bar.com', 'okpassword', 'Billy', 'Bonka');

// const dm1 = dmCreateV2(tester1.token, [globalOwnerId.authUserId]);
// const channel1 = channelsCreateV3(tester1.token, 'testingNotifs1', true);
// channelInviteV3(tester1.token, channel1.channelId, globalOwnerId.authUserId);

// const dm2 = dmCreateV2(tester2.token, [globalOwnerId.authUserId]);
// const channel2 = channelsCreateV3(tester2.token, 'testingNotifs2', false);
// channelInviteV3(tester2.token, channel2.channelId, globalOwnerId.authUserId);

// console.log(getNotificationsV1(globalOwnerId.token));

// const globalOwnerId = authRegisterV3('foo@bar.com', 'password', 'James', 'Charles');
// const tester = authRegisterV3('chocolate@bar.com', 'g00dpassword', 'Willy', 'Wonka');

// const dm1 = dmCreateV2(tester.token, [globalOwnerId.authUserId]);
// const channel1 = channelsCreateV3(tester.token, 'testingTagging', true);
// channelInviteV3(tester.token, channel1.channelId, globalOwnerId.authUserId);

// // globalOwner tags tester, and himself, testing with 20+ characters
// messageSenddmV2(globalOwnerId.token, dm1.dmId, 'hi @willywonka, ityttmom');
// messageSendV2(globalOwnerId.token, channel1.channelId, '@willywonka@jamescharles hello!');

// // 2 notifs test
// console.log(getNotificationsV1(tester.token));
// console.log('----------');
// console.log(getNotificationsV1(globalOwnerId.token));
// clearV1();
// const data = getData();
// const globalOwnerId = authRegisterV3('foo@bar.com', 'password', 'James', 'Charles');
// const tester1 = authRegisterV3('chocolate@bar.com', 'g00dpassword', 'Willy', 'Wonka');

// const dm1 = dmCreateV2(tester1.token, [globalOwnerId.authUserId]);
// const channel1 = channelsCreateV3(tester1.token, 'testingReacts', true);
// channelInviteV3(tester1.token, channel1.channelId, globalOwnerId.authUserId);

// // globalOwner sends a message to channel and DM
// const dmMessage = messageSenddmV2(globalOwnerId.token, dm1.dmId, 'hi');
// const channelMessage = messageSendV2(globalOwnerId.token, channel1.channelId, 'hi again');

// // tester reacts
// messageReactV1(tester1.token, dmMessage.messageId, 1);
// messageReactV1(tester1.token, channelMessage.messageId, 1);
// // console.log(data.reactDetails);
// console.log(getNotificationsV1(globalOwnerId.token));
/*
Array of objects, where each object contains types { channelId, dmId, notificationMessage } where

channelId is the id of the channel that the event happened in, and is -1 if it is being sent to a DM
dmId is the DM that the event happened in, and is -1 if it is being sent to a channel
notificationMessage is a string of the following format for each trigger action:

  tagged: "{User’s handle} tagged you in {channel/DM name}: {first 20 characters of the message}"
  reacted message: "{User’s handle} reacted to your message in {channel/DM name}"
  added to a channel/DM: "{User’s handle} added you to {channel/DM name}"

*/
