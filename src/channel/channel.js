import { getData, setData } from '../dataStore'

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

      channel.memberIds.push(uId); // add member
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
