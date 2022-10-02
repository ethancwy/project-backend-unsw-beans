import { getData, setData } from '../dataStore.js';

function channelJoinV1(authUserId, channelId) {
  return {};
}

function channelInviteV1(authUserId, channelId, uId) {
  return {};
}

function channelMessagesV1(authUserId, channelId, start) {
  return {
    messages: [
      {
        messageId: 1,
        uId: 1,
        message: 'Hello world',
        timeSent: 1582426789,
      }
    ],
    start: 0,
    end: 50,
  }
}

function channelDetailsV1(authUserId, channelId) {
  let data = getData();

  // checking if authUserId is valid
  let user_check = 0;
  for (const users of data.users.uId) {
    if (users === authUserId) {
      user_check = 1;
    }
  }

  if (user_check === 0) {
    return { error: 'error' };
  }

  //checking if channelId is valid
  let channel_check = 0;
  let channel_pos = 0;
  for (const channels in data.channels.channelId) {
    if (data.channels.channelId[channels] === channelId) {
      channel_check = 1;
      channel_pos = channels;
    }
  }

  if (channel_check === 0) {
    return { error: 'error' };
  }

  //checking if authUserId is in the channel
  user_check = 0;
  for (const members of data.channels[channel_pos].memberIds) {
    if (authUserId === members.uId) {
      user_check = 1;
    }
  }

  if (user_check === 0) {
    return { error: 'error' };
  }

  return {
    data.channels[channel_pos]
  };
}

export {
  channelJoinV1,
  channelInviteV1,
  channelMessagesV1,
  channelDetailsV1
};
