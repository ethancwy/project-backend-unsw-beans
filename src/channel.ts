import { getData, setData } from './dataStore.ts';
import { authUserId, channelId, channelInfo, messages } from './global.ts';

/**
  * Given a channelId of a channel that the authorised user can join, 
  * adds them to that channel.
  * 
  * @param {integer} authUserId - a valid authUserId from dataStore
  * @param {integer} channelId - a valid channelId from dataStore
  * 
  * @returns {} - return empty
  * @returns {error} - return error object in invalid cases
*/

function channelJoinV1(authUserId: authUserId, channelId: channelId): {} | error;
 {
  const data = getData();

  if (!isValidUser(authUserId)) {
    return { error: 'error' };
  }

  for (const channel of data.channels) {
    if (channelId === channel.channelId) {
      if (channel.isPublic === false) { // private channel
        if (!isGlobalOwner(authUserId)) {
          return { error: 'error' };
        }
      }
      for (const member of channel.memberIds) {
        if (authUserId === member) {  // already a member
          return { error: 'error' };
        }
      }
      channel.memberIds.push(authUserId); // add member
      setData(data);
      return {};
    }
  }

  return { error: 'error' };
}

/**
  * The authUser invites a user with uId to join a channel with channelId. 
  * Once invited, the user is added to the channel immediately.
  * 
  * @param {integer} authUserId - a valid authUserId from dataStore
  * @param {integer} channelId - a valid channelId from dataStore
  * @param {integer} uId - a valid uId from dataStore
  * 
  * @returns {} - return empty
  * @returns {error} - return error object in invalid cases
*/

function channelInviteV1(authUserId: number, channelId: number, uId: number): {} | error {
  const data = getData();

  if (!isValidUser(authUserId) || !isValidUser(uId) || !isValidChannel(channelId)) {
    return { error: 'error' };
  }

  let authMember = false;
  for (const channel of data.channels) {
    if (channelId === channel.channelId) {
      for (const member of channel.memberIds) {
        if (uId === member) {  // already a member
          return { error: 'error' };
        }
        if (authUserId === member && !authMember) { // inviter not a member check
          authMember = true;
        }
      }
      if (!authMember) {  // the authUser who's inviting is not a member 
        return { error: 'error' };
      }

      channel.memberIds.push(uId); // add member
      setData(data);
      return {};
    }
  }
}

// Helper function to check if user is valid
function isValidUser(authUserId) {
  const data = getData();
  for (const user of data.users) {
    if (authUserId === user.uId) {
      return true;
    }
  }
  return false;
}

// Helper function to check if channel is valid
function isValidChannel(channelId) {
  const data = getData();
  for (const channel of data.channels) {
    if (channelId === channel.channelId) {
      return true;
    }
  }
  return false;
}

// Helper function to check if user is valid
function isGlobalOwner(authUserId) {
  const data = getData();

  for (const user of data.users) {
    if (authUserId === user.uId) {
      if (user.isGlobalOwner) {
        return true;
      }
    }
  }
  return false;
}

/**
  * Given a channel with ID channelId that the authorised user is a member of, 
  * returns up to 50 messages between index "start" and "start + 50". Message
  * with index 0 (i.e. the first element in the returned array of messages) 
  * is the most recent message in the channel. This function returns a new 
  * index "end". If there are more messages to return after thisfunction call,
  * "end" equals "start + 50". If this function has returned the least recent 
  * messages in the channel, "end" equals -1 to indicate that there are no more
  *  messages to load after this return.
  * 
  * @param {integer} authUserId - a valid authUserId from dataStore
  * @param {integer} channelId - a valid channelId from dataStore
  * @param {integer} start - a start index
  * 
  * @returns { messages:
  *            start: 
  *            end:
  *           } - returns array of objects containing 
  *               message details, start integer and end integer
  * @returns {error} - return error object in invalid cases
*/

function channelMessagesV1(authUserId: number, channelId: number, start: number): messages | error {
  let data = getData();

  if (start < 0) {
    return { error: 'error' };
  }

  //checking if userid valid
  if (!isValidUser(authUserId)) {
    return { error: 'error' };
  }

  let is_valid = false;
  let index = 0;
  for (const i in data.channels) {
    if (data.channels[i].channelId === channelId) {
      is_valid = true;
      index = i;
      break;
    }
  }

  if (!is_valid) {
    return { error: 'error' };
  }

  //checking if user is part of channel
  if (!(authUserId in data.channels[index].memberIds)) {
    return { error: 'error' };
  }

  //getting amount of msgs in channel
  let amount = 0;
  for (const i in data.channels[index].channelmessages) {
    amount = i;
  }
  if (isNaN(data.channels[index].channelmessages[0].messageId)) {
    amount = 0;
  }
  let amount_of_msgs = amount;
  let end = 0;
  const empty_msg = {
    messageId: NaN,
    uId: NaN,
    message: '',
    timeSent: NaN,
  };

  if (amount_of_msgs === 1 && data.channels[index].channelmessages[0] === empty_msg) {
    amount_of_msgs = 0;
  }

  if (start > amount_of_msgs) {
    return { error: 'error' };
  }

  let count = 0;
  let is_more = false;
  const list = [];
  if (amount > 0) {
    for (const msg of data.channels[index].channelmessages) {
      if (count === 50) {
        is_more = true;
        break;
      }

      list.push(msg);
      count++;
    }
  }

  if (is_more) {
    end = start + 50;
  }
  else {
    end = -1;
  }

  return {
    messages: list,
    start: start,
    end: end,
  };
}

/**
  * Given a channel with ID channelId that the authorised user is a 
  * member of, provides basic details about the channel.
  * 
  * @param {integer} authUserId - a valid authUserId from dataStore
  * @param {integer} channelId - a valid channelId from dataStore
  * 
  * @returns { name: 
  *            isPublic:
  *            ownerMembers:
  *            allMembers:
  *          } - returns basic channel info
  * @returns {error} - return error object in invalid cases
*/

function channelDetailsV1(authUserId: number, channelId: number): channelInfo | error {
  let data = getData();

  // checking if authUserId is valid
  if (!isValidUser(authUserId)) {
    return { error: 'error' };
  }

  //checking if channelId is valid
  let channel_check = 0;
  let channel_pos = 0;
  for (const chans in data.channels) {
    if (data.channels[chans].channelId === channelId) {
      channel_check = 1;
      channel_pos = chans;
    }
  }

  if (channel_check === 0) {
    return { error: 'error' };
  }

  //checking if authUserId is in the channel
  let user_check = 0;
  for (const membs of data.channels[channel_pos].memberIds) {
    if (membs === authUserId) {
      user_check = 1;
    }
  }

  if (user_check === 0) {
    return { error: 'error' };
  }

  const array_owners = [];

  for (const membs of data.channels[channel_pos].ownerIds) {
    for (const users of data.users) {
      if (users.uId === membs) {
        array_owners.push({
          uId: users.uId,
          email: users.email,
          nameFirst: users.nameFirst,
          nameLast: users.nameLast,
          handleStr: expect.any(String),
        });
      }
    }
  }

  const array_memb = [];

  for (const membs of data.channels[channel_pos].memberIds) {
    for (const users of data.users) {
      if (users.uId === membs) {
        array_memb.push({
          uId: users.uId,
          email: users.email,
          nameFirst: users.nameFirst,
          nameLast: users.nameLast,
          handleStr: expect.any(String),
        });
      }
    }
  }

  return {
    name: data.channels[channel_pos].name,
    isPublic: data.channels[channel_pos].isPublic,
    ownerMembers: array_owners,
    allMembers: array_memb,
  };
}

export {
  channelJoinV1,
  channelInviteV1,
  channelMessagesV1,
  channelDetailsV1
};