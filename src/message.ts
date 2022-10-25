import { getData, setData } from './dataStore';
import { isValidToken, isValidChannel, isInChannel, getUserId, isDmMember, isDmValid, getChannelIndex, getDmIndex, getMessageDetails, isGlobalOwner } from './global';
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
  const messageId = data.messageDetails.length;
  const newMessage = {
    messageId: messageId,
    uId: uId,
    message: message,
    timeSent: requestTimesent(),
  };
  data.channels[cIndex].channelmessages.push(newMessage);
  data.messageDetails.push({
    uId: uId,
    messageId: messageId,
    isDm: false,
    listId: channelId,
  });
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

  const msg = getMessageDetails(messageId);

  if (msg === null) {
    return { error: 'error' };
  }

  if (!msg.isDm) {
    // check if user is in channel and has perms
    if (!data.channels[msg.listIndex].memberIds.includes(authUserId)) {
      return { error: 'error' };
    }
    if (!data.channels[msg.listIndex].ownerIds.includes(authUserId) && msg.uId !== authUserId && !isGlobalOwner(authUserId)) {
      return { error: 'error' };
    }
    data.channels[msg.listIndex].channelmessages.splice(msg.messageIndex, 1, message);
  } else {
    // check is user is in dm and has perms
    if (!data.dms[msg.listIndex].members.includes(authUserId)) {
      return { error: 'error' };
    }
    if (data.dms[msg.listIndex].owner !== authUserId && msg.uId !== authUserId) {
      return { error: 'error' };
    }
    data.dms[msg.listIndex].messages.splice(msg.messageIndex, 1, message);
  }

  return {};
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

  const msg = getMessageDetails(messageId);

  if (msg === null) {
    return { error: 'error' };
  }

  if (!msg.isDm) {
    // check if user is in channel and has perms
    if (!data.channels[msg.listIndex].memberIds.includes(authUserId)) {
      return { error: 'error' };
    }
    if (!data.channels[msg.listIndex].ownerIds.includes(authUserId) && msg.uId !== authUserId && !isGlobalOwner(authUserId)) {
      return { error: 'error' };
    }
    data.channels[msg.listIndex].channelmessages.splice(msg.messageIndex, 1);
  } else {
    // check is user is in dm and has perms
    if (!data.dms[msg.listIndex].members.includes(authUserId)) {
      return { error: 'error' };
    }
    if (data.dms[msg.listIndex].owner !== authUserId && msg.uId !== authUserId) {
      return { error: 'error' };
    }
    data.dms[msg.listIndex].messages.splice(msg.messageIndex, 1);
  }

  return {};
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
  const messageId = data.messageDetails.length;
  const newMessage = {
    messageId: messageId,
    uId: uId,
    message: message,
    timeSent: requestTimesent(),
  };
  data.dms[dmIndex].messages.push(newMessage);
  data.messageDetails.push({
    messageId: messageId,
    isDm: true,
    listId: dmId,
    uId: uId,
  });
  setData(data);
  return { messageId: messageId };
}

export { messageSendV1, messageEditV1, messageRemoveV1, messageSenddmV1 };
