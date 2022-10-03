import { getData, setData } from '../dataStore'

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
        if (user.isGlobalOwner === false) { // if not global owner
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

  if (!isValidUser(authUserId) || !isValidUser(uId)) {
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

      channel.memberIds.push(uId); // add member // if uId doesn't work, do u uId.authUserId
      setData(data);
      return {};
    }
  }

}

// Helper function to check if user is valid
function isValidUser(authUserId) {
  for (const user of data.users) {
    if (authUserId === user.uId) {
      return true;
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
  return {
    name: 'Hayden',
    ownerMembers: [
      {
        uId: 1,
        email: 'example@gmail.com',
        nameFirst: 'Hayden',
        nameLast: 'Jacobs',
        handleStr: 'haydenjacobs',
      }
    ],
    allMembers: [
      {
        uId: 1,
        email: 'example@gmail.com',
        nameFirst: 'Hayden',
        nameLast: 'Jacobs',
        handleStr: 'haydenjacobs',
      }
    ],
  };
}

export {
  channelJoinV1,
  channelInviteV1,
  channelMessagesV1,
  channelDetailsV1
};
