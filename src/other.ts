import { getData, setData } from './dataStore';
import { getUserId, isValidToken } from './global';

import HTTPError from 'http-errors';

function clearV1() {
  let data = getData();
  data = {
    users: [],
    channels: [],
    dms: [],
    sessionIds: [],
    messageDetails: [],
    inviteDetails: [],
    reactDetails: [],
    workspaceStats: {
      channelsExist: [{numChannelsExist: 0, timeStamp: 0}],
      dmsExist: [{numDmsExist: 0, timeStamp: 0}],
      messagesExist: [{numMessagesExist: 0, timeStamp: 0}],
      utilizationRate: 0,
    },
    counter: 0,
  };
  setData(data);
  return {};
}

function searchV1(token: string, queryStr: string) {
  const data = getData();

  // check is user session is valid
  if (!isValidToken(token)) {
    throw HTTPError(403, 'invalid session id');
  }

  if (queryStr.length < 1 || queryStr.length > 1000) {
    throw HTTPError(400, 'invalid queryStr length');
  }

  const authUserId = getUserId(token);

  const msgList = [];
  // checking channels
  for (const channel of data.channels) {
    if (!channel.memberIds.includes(authUserId)) {
      continue;
    }
    for (const message of channel.channelmessages) {
      if (message.uId === authUserId && message.message.includes(queryStr)) {
        const msg = message;
        delete msg.tags;
        msgList.push(msg);
      }
    }
  }

  // checking dms
  for (const dm of data.dms) {
    if (!dm.members.includes(authUserId)) {
      continue;
    }
    for (const message of dm.messages) {
      if (message.uId === authUserId && message.message.includes(queryStr)) {
        const msg = message;
        delete msg.tags;
        msgList.push(msg);
      }
    }
  }
  // const msgList = data.channels.filter(channel => {
  //   if (channel.memberIds.includes(authUserId)) {
  //     if (channel.channelmessages.uId === authUserId) {
  //       if (channel.channelmessages.message.includes(queryStr)) {
  //         let message = channel.channelmessages;
  //         delete message.tags;
  //         return message;
  //       }
  //     }
  //   }
  // });

  return { messages: msgList };
}

export {
  clearV1, searchV1
};
