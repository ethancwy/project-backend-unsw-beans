import { getData, setData } from './dataStore';
import { getUserId, isValidToken, isValidUser, isInChannel, isInDm } from './global';

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

  if (queryStr < 0 || queryStr.length > 1000) {
    throw HTTPError(400, 'invalid queryStr length');
  }

  const authUserId = getUserId(token);

  const msgList = data.channels.filter(channel => {
    if (channel.memberIds.includes(authUserId)) {
      if (channel.channelmessages.uId === authUserId) {
        if (channel.channelmessages.message.includes(queryStr)) {
          let message = channel.channelmessages;
          delete message.tags;
          return message;
        }
      }
    }
  });

  return { messages: msgList };
}

export {
  clearV1, searchV1
};
