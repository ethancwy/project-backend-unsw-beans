import { getData, setData } from '../dataStore.js';

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

function channelJoinV1(authUserId, channelId) {
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

function channelInviteV1(authUserId, channelId, uId) {
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