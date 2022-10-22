import { getData, setData } from './dataStore';
import { isValidToken, isValidChannel, isInChannel, getUserId, isChannelOwner, isDmMember, isDmValid, getChannelIndex, getDmIndex} from './global';
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
  if (!isInChannel(uId, channelId) ) {
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

function messageEditV1 (token: string, messageId: number, message: string) {
  const data = getData();
  if (!isValidToken) {
    return { error: 'error' };
  }

  if (message.length > 1000) {
    return { error: 'error' };
  }

  for (var user of data.users) {
    if (user.tokens.includes(token)) {
      return user;
    }
  }

  let findMessInCha;
  for(var cIndex = 0; cIndex < data.channels.length; cIndex++) {
    findMessInCha = data.channels[cIndex].channelmessages.find(m => m.messageId === messageId);
    if (findMessInCha !== undefined) {
      break;
    } 
  }

  if (findMessInCha === undefined && data.dms !== []) {
    let findMessageDM;
    for(var dmIndex = 0; dmIndex < data.dms.length; dmIndex++) {
      findMessageDM = data.dms[dmIndex].messages.find(m => m.messageId === messageId);
      if (findMessInCha !== undefined) {
        break;
      } 
    }

    const findDm = data.dms[dmIndex];
    if (findMessageDM === undefined || findMessageDM.uId !== user.uId || findDm.owner !== user.uId) {
      return ({ error: 'error' });
    }
    if (message.length === 0) {
      for (const i in findDm.messages) {
        if (findDm.messages[i].messageId === messageId) {
          findDm.messages.splice(Number(i), 1);
          setData(data);
          return {};
        }
      }
    }
    findMessageDM.message = message;
    findMessageDM.timeSent = requestTimesent();
    setData(data);
    return { };
  } 

  else {
    if (findMessInCha.uId !== user.uId) {
      return ({ error: 'error' });
    }
    const findChannel = data.channels[cIndex];

    if (findChannel.ownerIds.find(c => c === user.uId) === undefined) {
      return ({ error: 'error' });
    }

    if (message.length === 0) {
      for (const channel of data.channels) {
        for (const i in channel.channelmessages) {
          if (channel.channelmessages[i].messageId === messageId) {
            channel.channelmessages.splice(Number(i), 1);
            setData(data);
            return { };
          }
        }
      }
    }
    findMessInCha.message = message;
    findMessInCha.timeSent = requestTimesent();
    setData(data);
    return {};
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

function messageRemoveV1 (token: string, messageId: number) {
  /*const data = getData();
  const userId = getUserId(token);
  if (!isValidToken) {
    return { error: 'error' };
  }
  // message is not in the channel/dm
  const channel = data.channels.find((item: { channelmessages: any[]; }) => item.channelmessages.map(mes => mes.messageId).includes(messageId));
  const dm = data.dms.find((item: { messages: any[]; }) => item.messages.map(mes => messageId).includes(messageId));
  if (channel === undefined && dm === undefined) {
    return { error: 'error' };
  }
  // check is the author in the channel/dm
  const userInChannel = isInChannel(userId, channel.channelId);
  const userInDm = isDmMember(userId, dm.dmId);
  if (!userInChannel || !userInDm) {
    return { error: 'error' };
  }
  // the message was not sent by authorised user making the request
  const message = data.messages.find(m => m.messageId = messageId);

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
  */
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
  
  if (message.length < 1 || message.length > 1000 ){
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
