import { getData, setData } from './dataStore';
import {
  isValidUser, isValidChannel, isGlobalOwner, isValidToken,
  getUserId, isInChannel, isChannelOwner, isOnlyOwner
} from './global';

/**
  * Given a channelId of a channel that the authorised user can join,
  * adds them to that channel.
  *
  * @param {string} token - a valid token
  * @param {integer} channelId - a valid channelId from dataStore
  *
  * @returns {} - return empty
  * @returns {error} - return error object in invalid cases
*/

function channelJoinV2(token: string, channelId: number) {
  const data = getData();

  if (!isValidToken(token)) {
    return { error: 'error' };
  }

  const authUserId = getUserId(token);

  for (const channel of data.channels) {
    if (channelId === channel.channelId) {
      if (channel.isPublic === false) { // private channel
        if (!isGlobalOwner(authUserId)) {
          return { error: 'error' };
        }
      }
      for (const member of channel.memberIds) {
        if (authUserId === member) { // already a member
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
  * @param {string} token - a valid token
  * @param {integer} channelId - a valid channelId from dataStore
  * @param {integer} uId - a valid uId from dataStore
  *
  * @returns {} - return empty
  * @returns {error} - return error object in invalid cases
*/

function channelInviteV2(token: string, channelId: number, uId: number) {
  const data = getData();

  if (!isValidToken(token) || !isValidUser(uId) || !isValidChannel(channelId)) {
    return { error: 'error' };
  }

  const authUserId = getUserId(token);

  let authMember = false;
  for (const channel of data.channels) {
    if (channelId === channel.channelId) {
      for (const member of channel.memberIds) {
        if (uId === member) { // already a member
          return { error: 'error' };
        }
        if (authUserId === member && !authMember) { // inviter not a member check
          authMember = true;
        }
      }
      if (!authMember) { // the authUser who's inviting is not a member
        return { error: 'error' };
      }

      channel.memberIds.push(uId); // add member
      setData(data);
      return {};
    }
  }
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

function channelMessagesV2(token: string, channelId: number, start: number) {
  const data = getData();

  if (!isValidToken(token)) {
    return { error: 'error' };
  }

  const authUserId = getUserId(token);

  if (start < 0) {
    return { error: 'error' };
  }

  // checking if userid valid
  if (!isValidUser(authUserId)) {
    return { error: 'error' };
  }

  let isValid = false;
  let index = 0;
  for (const i in data.channels) {
    if (data.channels[i].channelId === channelId) {
      isValid = true;
      index = parseInt(i);
      break;
    }
  }

  if (!isValid) {
    return { error: 'error' };
  }

  // checking if user is part of channel
  if (!(authUserId in data.channels[index].memberIds)) {
    return { error: 'error' };
  }

  // getting amount of msgs in channel
  const amountOfMsgs = data.channels[index].channelmessages.length;
  let end = 0;

  if (start > amountOfMsgs) {
    return { error: 'error' };
  }

  let count = 0;
  let isMore = false;
  const list = [];
  if (amountOfMsgs > 0) {
    for (const msg of data.channels[index].channelmessages) {
      if (count === 50) {
        isMore = true;
        break;
      }

      list.push(msg);
      count++;
    }
  }

  if (isMore) {
    end = start + 50;
  } else {
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
  * @param {string} token - a valid authUserId from dataStore
  * @param {integer} channelId - a valid channelId from dataStore
  *
  * @returns { name:
  *            isPublic:
  *            ownerMembers:
  *            allMembers:
  *          } - returns basic channel info
  * @returns {error} - return error object in invalid cases
*/

function channelDetailsV2(token: string, channelId: number) {
  const data = getData();
  const uId = getUserId(token);

  // checking if channelId is valid
  let channelCheck = false;
  let channelPos = 0;
  for (const chans in data.channels) {
    if (data.channels[chans].channelId === channelId) {
      channelCheck = true;
      channelPos = parseInt(chans);
    }
  }

  if (channelCheck === false) {
    return { error: 'error' };
  }

  // checking if token is valid and if in channel
  if (!isValidToken(token) || !isInChannel(uId, channelId)) {
    return { error: 'error' };
  }

  const arrayOwners = [];
  for (const membs of data.channels[channelPos].ownerIds) {
    for (const users of data.users) {
      if (users.uId === membs) {
        arrayOwners.push({
          uId: users.uId,
          email: users.email,
          nameFirst: users.nameFirst,
          nameLast: users.nameLast,
          handleStr: users.handleStr,
        });
      }
    }
  }

  const arrayMemb = [];
  for (const membs of data.channels[channelPos].memberIds) {
    for (const users of data.users) {
      if (users.uId === membs) {
        arrayMemb.push({
          uId: users.uId,
          email: users.email,
          nameFirst: users.nameFirst,
          nameLast: users.nameLast,
          handleStr: users.handleStr,
        });
      }
    }
  }

  return {
    name: data.channels[channelPos].name,
    isPublic: data.channels[channelPos].isPublic,
    ownerMembers: arrayOwners,
    allMembers: arrayMemb,
  };
}

/**
  * Given a channel with ID channelId that the authorised user is a
  * member of, remove them as a member of the channel.
  *
  * @param {string} token - a valid token
  * @param {integer} channelId - a valid channelId from dataStore
  *
  * @returns {} - return empty
  * @returns {error} - return error object in invalid cases
*/

function channelLeaveV1(token: string, channelId: number) {
  const data = getData();
  const uId = getUserId(token);

  if (!isValidToken(token) || !isValidChannel(channelId) || !isInChannel(uId, channelId)) {
    return { error: 'error' };
  }

  // if owner, remove from ownerids and memberids
  // if normal member, remove from memberids
  for (const channel of data.channels) {
    if (channelId === channel.channelId) {
      for (const index in channel.ownerIds) {
        if (channel.ownerIds[index] === uId) {
          channel.ownerIds.splice(parseInt(index), 1);
          break;
        }
      }
      for (const index in channel.memberIds) {
        if (channel.memberIds[index] === uId) {
          channel.memberIds.splice(parseInt(index), 1);
          break;
        }
      }
      break;
    }
  }
  setData(data);
  return {};
}

/**
  * Make user with user id uId an owner of the channel.
  *
  * @param {string} token - a valid token
  * @param {integer} channelId - a valid channelId from dataStore
  *
  * @returns {} - return empty
  * @returns {error} - return error object in invalid cases
*/

function channelAddOwnerV1(token: string, channelId: number, uId: number) {
  const data = getData();
  if (!isValidToken(token) || !isValidChannel(channelId) || !isValidUser(uId)) {
    // Invalid token, channelId, or uId
    return { error: 'error' };
  } else if (!isInChannel(uId, channelId) || isChannelOwner(uId, channelId)) {
    // uId not a member of channel, uId already an owner
    return { error: 'error' };
  }

  const authUserId = getUserId(token);
  // authUserId no owner perms
  if (!isGlobalOwner(authUserId) && !isChannelOwner(authUserId, channelId)) {
    return { error: 'error' };
  }

  for (const channel of data.channels) {
    if (channelId === channel.channelId) {
      channel.ownerIds.push(uId);
      break;
    }
  }
  setData(data);
  return {};
}

/**
  * Remove user with user id uId as an owner of the channel.
  *
  * @param {string} token - a valid token
  * @param {integer} channelId - a valid channelId from dataStore
  *
  * @returns {} - return empty
  * @returns {error} - return error object in invalid cases
*/

function channelRemoveOwnerV1(token: string, channelId: number, uId: number) {
  const data = getData();
  // Invalid token, channelId, uId, and not a channelOwner
  if (!isValidToken(token) || !isValidChannel(channelId) || !isValidUser(uId) ||
    !isChannelOwner(uId, channelId)) {
    return { error: 'error' };
  }

  // Only owner in channel
  if (isOnlyOwner(uId, channelId)) {
    return { error: 'error' };
  }

  const authUserId = getUserId(token);
  // authUserId no owner perms
  if (!isGlobalOwner(authUserId) && !isChannelOwner(authUserId, channelId)) {
    return { error: 'error' };
  }

  for (const channel of data.channels) {
    if (channelId === channel.channelId) {
      for (const index in channel.ownerIds) {
        if (channel.ownerIds[index] === uId) {
          channel.ownerIds.splice(parseInt(index), 1);
          break;
        }
      }
      break;
    }
  }
  setData(data);
  return {};
}

export {
  channelJoinV2,
  channelInviteV2,
  channelMessagesV2,
  channelDetailsV2,
  channelLeaveV1,
  channelAddOwnerV1,
  channelRemoveOwnerV1
};
