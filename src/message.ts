import { getData, setData } from './dataStore';
import { isValidToken, isValidChannel, isInChannel, getUserId, isChannelOwner, isDmMember } from './global';
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

function messageSendV1 (token: string, channelId: number, message: string) {
  const data = getData();
  const uId = getUserId(token);

  // check invalid statement
  if (!isValidToken || !isValidChannel(channelId) || !isInChannel(uId, channelId) || message.length < 1 || message.length > 1000) {
    return { error: 'error' };
  }

  const messageId = data.messages.length;
  const channel = data.channels.find((item: {channelId: number;}) => item.channelId === channelId);
  const newMessage = {
    messageId: messageId,
    uId: uId,
    message: message,
    timeSent: requestTimesent(),
  };
  data.messages.push(newMessage);
  channel.channelmessages.push(newMessage);
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

function messageEditV1 (token: string, messageId: number, message: string) {
  const data = getData();
  const userId = getUserId(token);

  if (!isValidToken || message.length > 1000) {
    return { error: 'error' };
  }
  // messageId does not refer to valid message within authorised user
  const channel = data.channels.find((item: { channelmessages: any[]; }) => item.channelmessages.map(mes => mes.messageId).includes(messageId));
  const dm = data.dms.find((item: { messages: any[]; }) => item.messages.map(mes => messageId).includes(messageId));
  if (channel === undefined && dm === undefined) {
    return { error: 'error' };
  }
  // the message was not sent by authorised user making the request
  const findmessage = data.messages.find((item: { messageId: number; }) => item.messageId === messageId);
  // user doer not have owner permission
  if (channel === undefined && dm.owner !== userId && findmessage.uId !== userId) {
    return { error: 'error' };
  }
  const permission = isChannelOwner(userId, channel.channelId);
  if (dm === undefined && !permission) {
    return { error: 'error' };
  }

  // edit the message
  if (message === '') {
    messageRemoveV1(token, messageId);
  }
  if (dm === undefined) {
    const newCnMessages = channel.channelmessages.map((m: { messageId: number; }) => {
      if (m.messageId === messageId) {
        return {
          ...m,
          message: message
        };
      }
      return m;
    });
    channel[messageId].channelmessages = newCnMessages;
  }

  if (channel === undefined) {
    const newDmMessages = dm.messages.map((m: { messageId: number; }) => {
      if (m.messageId === messageId) {
        return {
          ...m,
          message: message
        };
      }
      return m;
    });
    dm[messageId].messages = newDmMessages;
  }

  setData(data);
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

function messageRemoveV1 (token: string, messageId: number) {
  const data = getData();
  const userId = getUserId(token);

  if (!isValidToken) {
    return { error: 'error' };
  }
  // messageId does not refer to valid message within authorised user
  const channel = data.channels.find((item: { channelmessages: any[]; }) => item.channelmessages.map(mes => mes.messageId).includes(messageId));
  const dm = data.dms.find((item: { messages: any[]; }) => item.messages.map(mes => messageId).includes(messageId));
  if (channel === undefined && dm === undefined) {
    return { error: 'error' };
  }
  // the message was not sent by authorised user making the request
  const message = data.messages.find((item: { messageId: number; }) => item.messageId === messageId);
  // user doer not have owner permission
  if (channel === undefined && dm.owner !== userId && message.uId !== userId) {
    return { error: 'error' };
  }
  const permission = isChannelOwner(userId, channel.channelId);
  if (dm === undefined && !permission) {
    return { error: 'error' };
  }

  const currentMessages = data.messages.filter((message: { messageId: number; }) => message.messageId !== messageId);
  data.messages = currentMessages;
  if (channel === undefined) {
    const currentDmMessages = dm.messages.filter((message: { messageId: number; }) => message.messageId !== messageId);
    dm.messages = currentDmMessages;
  }
  if (dm === undefined) {
    const currentChannelMessages = channel.channelmessages.filter((message: { messageId: number; }) => message.messageId !== messageId);
    channel.channelmessages = currentChannelMessages;
  }

  setData(data);
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
  const dm = data.dms.find((item: {dmId: number;}) => item.dmId === dmId);
  const checkdmId = isDmMember(uId, dmId);

  // check invalid statment
  if (message.length < 1 || message.length > 1000 || !isValidToken(token) || dm === undefined || !checkdmId ){
    return { error: 'error' };
  }

  const messageId = data.messages.length;
  const newMessage = {
    messageId: messageId,
    uId: uId,
    message: message,
    timeSent: requestTimesent(),
  };
  data.messages.push(newMessage);
  setData(data);
  return { messageId: messageId };
}

export { messageSendV1, messageEditV1, messageRemoveV1, messageSenddmV1 };
