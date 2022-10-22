import { getData, setData } from './dataStore';
import { isValidToken, isValidChannel, isInChannel, getUserId, isDmMember, isDmValid, getChannelIndex, getDmIndex } from './global';
const requestTimesent = () => Math.floor((new Date()).getTime() / 1000);

/**
  * Send a message from the authorised user to the channel specified by channelId.
  * Note: Each message should have its own unique ID, i.e. no messages should share
  * an ID with another message, even if that other message is in a different channel.
  *
  * @param {string} token - a valid authUserId from datadata
  * @param {number} channelId - a valid channelId from datadata
  * @param {string} message - string send by authorised user
  *
  * @returns {messageId} - the message id from the message sent by
  * @returns {error: error} - return error object in invalid cases
*/

function messageSendV1(token: string, channelId: number, message: string) {
  const data = getData();
  const uId = getUserId(token);
  if (!isValidToken) {
    return { error: 'error' };
  }
  if (!isValidChannel(channelId)) {
    return { error: 'error' };
  }
  // check the message exist but the length is wrong
  if (message.length < 1 || message.length > 1000) {
    return { error: 'error' };
  }
  // check the user is not in the channel
  if (!isInChannel(uId, channelId)) {
    return { error: 'error' };
  }

  const cIndex = getChannelIndex(channelId);
  const messageId = data.channels[cIndex].channelmessages.length;
  const newMessage = {
    messageId: messageId,
    uId: uId,
    message: message,
    timeSent: requestTimesent(),
  };
  data.channels[cIndex].channelmessages.push(newMessage);
  setData(data);
  return { messageId: messageId };
}

/**
  * Given a message, update its text with new text. If the new message is an
  * empty string, the message is deleted.
  *
  * @param {string} token - a valid authUserId from datadata
  * @param {number} messageId - a valid messageId from datadata
  * @param {string} message - string send by authorised user
  *
  * @returns {} - return empty
  * @returns {error: error} - return error object in invalid cases
*/

function messageEditV1(token: string, messageId: number, message: string) {
  const data = getData();

  if (message.length > 1000) {
    return { error: 'error' };
  }

  if (!isValidToken) {
    return { error: 'error' };
  }
  const authUserId = getUserId(token);

  let isFound = false;
  let isDm = false;
  let channelIndex = 0;
  let dmIndex = 0;
  let messageIndex = 0;

  for (const cIndex in data.channels) {
    if (data.channels[cIndex].memberIds.includes(authUserId)) {
      for (const mIndex in data.channels[cIndex].channelmessages) {
        if (data.channels[cIndex].channelmessages[mIndex].messageId === messageId) {
          isFound = true;
          isDm = false;
          channelIndex = parseInt(cIndex);
          messageIndex = parseInt(mIndex);
          break;
        }
      }
    }
  }

  if (!isFound) {
    for (const dIndex in data.dms) {
      if (data.dms[dIndex].members.includes(authUserId)) {
        for (const mIndex in data.dms[dIndex].messages) {
          if (data.dms[dIndex].messages[mIndex].messageId === messageId) {
            isFound = true;
            isDm = true;
            dmIndex = parseInt(dIndex);
            messageIndex = parseInt(mIndex);
            break;
          }
        }
      }
    }
  }

  if (!isFound) {
    return { error: 'error' };
  }

  if (!isDm) {
    if (data.channels[channelIndex].channelmessages[messageIndex].uId !== authUserId && !data.channels[channelIndex].ownerIds.includes(authUserId)) {
      return { error: 'error' };
    } else {
      data.channels[channelIndex].channelmessages[messageIndex].message = message;
      return {};
    }
  } else {
    if (data.dms[dmIndex].messages[messageIndex].uId !== authUserId && data.dms[dmIndex].owner !== authUserId) {
      return { error: 'error' };
    } else {
      data.dms[dmIndex].messages[messageIndex].message = message;
      return {};
    }
  }
}

/**
  * Given a messageId for a message, this message is removed from the channel/DM
  *
  * @param {string} token - a valid authUserId from datadata
  * @param {number} messageId - a valid messageId from datadata
  *
  *
  * @returns {} - return empty
  * @returns {error: error} - return error object in invalid cases
*/

function messageRemoveV1(token: string, messageId: number) {
  const data = getData();

  if (!isValidToken) {
    return { error: 'error' };
  }
  const authUserId = getUserId(token);

  let isFound = false;
  let isDm = false;
  let channelIndex = 0;
  let dmIndex = 0;
  let messageIndex = 0;

  for (const cIndex in data.channels) {
    if (data.channels[cIndex].memberIds.includes(authUserId)) {
      for (const mIndex in data.channels[cIndex].channelmessages) {
        if (data.channels[cIndex].channelmessages[mIndex].messageId === messageId) {
          isFound = true;
          isDm = false;
          channelIndex = parseInt(cIndex);
          messageIndex = parseInt(mIndex);
          break;
        }
      }
    }
  }

  if (!isFound) {
    for (const dIndex in data.dms) {
      if (data.dms[dIndex].members.includes(authUserId)) {
        for (const mIndex in data.dms[dmIndex].messages) {
          if (data.dms[dIndex].messages[mIndex].messageId === messageId) {
            isFound = true;
            isDm = true;
            dmIndex = parseInt(dIndex);
            messageIndex = parseInt(mIndex);
            break;
          }
        }
      }
    }
  }

  if (!isFound) {
    return { error: 'error' };
  }

  if (!isDm) {
    if (data.channels[channelIndex].channelmessages[messageIndex].uId !== authUserId && !data.channels[channelIndex].ownerIds.includes(authUserId)) {
      return { error: 'error' };
    } else {
      data.channels[channelIndex].channelmessages.splice(messageIndex, 1);
      return {};
    }
  } else {
    if (data.dms[dmIndex].messages[messageIndex].uId !== authUserId && data.dms[dmIndex].owner !== authUserId) {
      return { error: 'error' };
    } else {
      data.dms[dmIndex].messages.splice(messageIndex, 1);
      return {};
    }
  }
}

/**
  * Send a message from authorised user to the DM specified by dmId.
  * Note: Each message should have it's own unique ID, i.e. no messages
  * should share an ID with another message, even if that other message
  * is in a different channel or DM.
  *
  * @param {string} token - a valid authUserId from datadata
  * @param {number} dmId - a valid dmId from datadata
  * @param {string} message - a valid message from datadata
  *
  *
  * @returns {messageId} - the message id from the message sent by
  * @returns {error: error} - return error object in invalid cases
*/

function messageSenddmV1 (token: string, dmId: number, message: string) {
  const data = getData();
  const uId = getUserId(token);
  if (!isValidToken) {
    return { error: 'error' };
  }

  if (!isDmValid(dmId)) {
    return { error: 'error' };
  }
  const checkdmId = isDmMember(uId, dmId);

  if (message.length < 1 || message.length > 1000) {
    return { error: 'error' };
  }
  if (!checkdmId) {
    return { error: 'error' };
  }

  const dmIndex = getDmIndex(dmId);
  const messageId = data.dms[dmIndex].messages.length;
  const newMessage = {
    messageId: messageId,
    uId: uId,
    message: message,
    timeSent: requestTimesent(),
  };
  data.dms[dmIndex].messages.push(newMessage);
  setData(data);
  return { messageId: messageId };
}

export { messageSendV1, messageEditV1, messageRemoveV1, messageSenddmV1 };
