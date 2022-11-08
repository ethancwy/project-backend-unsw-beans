import { getData, MessageDetails, channel } from './dataStore';
import validator from 'validator';
import request, { HttpVerb } from 'sync-request';
import { port, url } from './config.json';
import { user as userType } from './dataStore';
const SERVER_URL = `${url}:${port}`;

// const OK = 200;

// =================================================== //
//                                                     //
//                       Types                         //
//                                                     //
// ==================================================  //

export type authUserId = { authUserId: number };

export type channelId = { channelId: number };

export type channels = {
  channels: {
    channelId: number,
    name: string
  }
};

export type user = {
  users: {
    uId: number;
    email: string;
    nameFirst: string;
    nameLast: string;
    handleStr: string;
    isGlobalOwner: boolean;
    tokens: Array<string>;
  }
};

export type messages = {
  messages: string[];
  start: number;
  end: number;
};

export type channelInfo = {
  name: string;
  isPublic: boolean;
  ownerMembers: user[];
  allMembers: user[];
};

export type error = { error: string };

// =================================================== //
//                                                     //
//                  Helper functions                   //
//                                                     //
// ==================================================  //

// Checks if user is valid
export function isValidUser(authUserId: number) {
  const data = getData();
  for (const user of data.users) {
    if (authUserId === user.uId && !user.isRemoved) {
      return true;
    }
  }
  return false;
}

// Fetch the channel index
export function getChannelIndex(channelId: number) {
  const data = getData();
  for (let cIndex = 0; cIndex < data.channels.length; cIndex++) {
    if (data.channels[cIndex].channelId === channelId) {
      return cIndex;
    }
  }
}

export function getChannelDetails(channelId: number) {
  const data = getData();
  for (const channel of data.channels) {
    if (channel.channelId === channelId) {
      return {
        name: channel.name,
        channelId: channel.channelId,
      };
    }
  }
}

export function getDmDetails(dmId: number) {
  const data = getData();
  for (const dm of data.dms) {
    if (dm.dmId === dmId) {
      return {
        name: dm.name,
        dmId: dm.dmId,
      };
    }
  }
}

// Fetch the dm index
export function getDmIndex(dmId: number) {
  const data = getData();
  for (let dmIndex = 0; dmIndex < data.dms.length; dmIndex++) {
    if (data.dms[dmIndex].dmId === dmId) {
      return dmIndex;
    }
  }
}

export function getTags(message: string) {
  const data = getData();
  const tagged = [];
  if (message.includes('@')) {
    for (const user of data.users) {
      if (message.includes(`@${user.handleStr}`)) {
        tagged.push(user.uId);
      }
    }
  }

  return tagged;
}

// Fetch message index from channel/dm
export function getMessageDetails(messageId: number) {
  const data = getData();
  // const msg = data.messageDetails.find(msg => msg.messageId === messageId);
  let msg: MessageDetails = null;
  for (const message of data.messageDetails) {
    if (message.messageId === messageId) {
      msg = message;
      break;
    }
  }

  if (msg === null) return null;

  let messageIndex = 0;
  let listIndex = 0;

  if (!msg.isDm) {
    // listIndex = data.channels.findIndex(channel => channel.channelId === msg.listId);
    // messageIndex = data.channels[listIndex].channelmessages.findIndex(msg => msg.messageId === messageId);
    for (const i in data.channels) {
      if (data.channels[i].channelId === msg.listId) {
        listIndex = parseInt(i);
        for (const j in data.channels[listIndex].channelmessages) {
          if (data.channels[i].channelmessages[j].messageId === messageId) {
            messageIndex = parseInt(j);
            break;
          }
        }
        break;
      }
    }
  } else {
    // listIndex = data.dms.findIndex(dm => dm.dmId === msg.listId);
    // messageIndex = data.dms[listIndex].messages.findIndex(msg => msg.messageId === messageId);
    for (const i in data.dms) {
      if (data.dms[i].dmId === msg.listId) {
        listIndex = parseInt(i);
        for (const j in data.dms[i].messages) {
          if (data.dms[listIndex].messages[j].messageId === messageId) {
            messageIndex = parseInt(j);
            break;
          }
        }
        break;
      }
    }
  }
  return {
    uId: msg.uId,
    isDm: msg.isDm,
    listIndex: listIndex,
    messageIndex: messageIndex,
    tags: msg.tags,
  };
}

export function isActiveStandup(channelId: number) {
  const data = getData();
  for (const i of data.channels) {
    if (i.channelId === channelId) {
      if (i.standupDetails.isActiveStandup) {
        return true;
      }
    }
  }
  return false;
}

// Checks if channel is valid
export function isValidChannel(channelId: number) {
  const data = getData();
  for (const channel of data.channels) {
    if (channelId === channel.channelId) {
      return true;
    }
  }
  return false;
}

// Checks if user is global owner
export function isGlobalOwner(authUserId: number) {
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

// Helper function to pause time
export function sleep(milliseconds: number) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

// Checks if token is valid
export function isValidToken(token: string) {
  const data = getData();

  if (data.sessionIds.includes(token)) {
    const uId = getUserId(token);
    const user = data.users.find((user: userType) => user.uId === uId);
    if (!user.isRemoved) {
      return true;
    }
  }
  return false;
}

export function getChannel(channelId: number, channelsArray: channel[]) {
  let channel: channel;
  for (let i = 0; i < channelsArray.length; i++) {
    if (channelId === channelsArray[i].channelId) {
      channel = channelsArray[i];
    }
  }
  return channel;
}

// Checks if user is in channel
export function isInChannel(uId: number, channelId: number) {
  const data = getData();

  for (const channel of data.channels) {
    if (channel.channelId === channelId) {
      for (const member of channel.memberIds) {
        if (uId === member) {
          return true;
        }
      }
    }
  }
  return false;
}

// Checks if user is in dm
export function isInDm(uId: number, dmId: number) {
  const data = getData();

  for (const dm of data.dms) {
    if (dm.dmId === dmId) {
      for (const member of dm.members) {
        if (uId === member) {
          return true;
        }
      }
    }
  }
  return false;
}

// Checks if user is channel owner or global owner (to check for channel perms)
// Return true if either, false otherwise
export function isChannelOwner(uId: number, channelId: number) {
  const data = getData();

  // check for channel owner
  for (const channel of data.channels) {
    if (channelId === channel.channelId) {
      for (const owner of channel.ownerIds) {
        if (uId === owner) {
          return true;
        }
      }
    }
  }
  return false;
}

// Checks if user is the only channel owner in given channel
export function isOnlyOwner(uId: number, channelId: number) {
  const data = getData();

  if (!isChannelOwner(uId, channelId)) {
    return { error: 'error' };
  }

  for (const channel of data.channels) {
    if (channelId === channel.channelId) {
      if (channel.ownerIds.length === 1) {
        return true;
      }
    }
  }
  return false;
}

// Helper function to find authUserId of token owner
export function getUserId(token: string) {
  const data = getData();

  for (const user of data.users) {
    if (user.tokens.includes(token)) {
      return user.uId;
    }
  }
}

// Checks if valid email address
export function validEmail(email: string) {
  return validator.isEmail(email);
}

// Checks if valid first name
export function validName(name: string) {
  if (name.length < 1 || name.length > 50) {
    return false;
  }
  return true;
}

// Checks if another user has email in use
export function anotherUserEmail(token: string, email: string) {
  const data = getData();

  for (const user of data.users) {
    if (email === user.email) {
      if (user.tokens.includes(token)) {
        // own email
        return false;
      }
      // someone else's email
      return true;
    }
  }
  return false;
}

export function alphanumeric(handleStr: string) {
  return /^[A-Za-z0-9]*$/.test(handleStr);
}

export function isValidHandleLength(handleStr: string) {
  if (handleStr.length < 3 || handleStr.length > 20) {
    return false;
  }
  return true;
}

export function anotherUserHandle(token: string, handleStr: string) {
  const data = getData();

  for (const user of data.users) {
    if (handleStr === user.handleStr) {
      if (user.tokens.includes(token)) {
        // own handleStr
        return false;
      }
      // someone else's handleStr
      return true;
    }
  }
  return false;
}

// Checks if dmId refers to a valid dm
export function isDmValid(dmId: number) {
  const data = getData();

  for (const Dms of data.dms) {
    if (Dms.dmId === dmId) {
      return true;
    }
  }

  return false;
}

// Checks if user is a member of dm
export function isDmMember(uid: number, dmId: number) {
  const data = getData();

  for (const uids of data.dms[dmId].members) {
    if (uids === uid) {
      return true;
    }
  }

  return false;
}

// ================================ WRAPPER HELPER FUNCTIONS ============================== //

export function requestHelper(method: HttpVerb, path: string, payload: object, token?: string) {
  let qs = {};
  let json = {};
  if (['GET', 'DELETE'].includes(method)) {
    qs = payload;
  } else {
    // PUT/POST
    json = payload;
  }

  const headers = { token: token };

  const res = request(method, SERVER_URL + path, { qs, json, headers });
  if (res.statusCode !== 200) {
    // Return error code number instead of object in case of error.
    return res.statusCode;
  }
  // expect(res.statusCode).toBe(OK);
  return JSON.parse(res.getBody() as string);
}

// ============================ Iteration 1 function wrappers ================================//
export function authLogin(email: string, password: string) {
  return requestHelper('POST', '/auth/login/v3', { email, password });
}
export function authRegister(email: string, password: string, nameFirst: string, nameLast: string) {
  return requestHelper('POST', '/auth/register/v3', { email, password, nameFirst, nameLast });
}
// ===========================================================================================//
export function channelsCreate(token: string, name: string, isPublic: boolean) {
  return requestHelper('POST', '/channels/create/v3', { name, isPublic }, token);
}
export function channelsList(token: string) {
  return requestHelper('GET', '/channels/list/v3', {}, token);
}
export function channelsListAll(token: string) {
  return requestHelper('GET', '/channels/listall/v3', {}, token);
}
// ===========================================================================================//
export function channelDetails(token: string, channelId: number) {
  return requestHelper('GET', '/channel/details/v3', { channelId }, token);
}
export function channelJoin(token: string, channelId: number) {
  return requestHelper('POST', '/channel/join/v3', { channelId }, token);
}
export function channelInvite(token: string, channelId: number, uId: number) {
  return requestHelper('POST', '/channel/invite/v3', { channelId, uId }, token);
}
export function channelMessages(token: string, channelId: number, start: number) {
  return requestHelper('GET', '/channel/messages/v3', { channelId, start }, token);
}
// ===========================================================================================//
export function userProfile(token: string, uId: number) {
  return requestHelper('GET', '/user/profile/v3', { uId }, token);
}
// ===========================================================================================//
export function clear() {
  return requestHelper('DELETE', '/clear/v1', {});
}

// ============================ New Iteration 2 function wrappers ================================//
export function authLogout(token: string) {
  return requestHelper('POST', '/auth/logout/v2', {}, token);
}
// ===============================================================================================//
export function channelLeave(token: string, channelId: number) {
  return requestHelper('POST', '/channel/leave/v2', { channelId }, token);
}
export function channelAddOwner(token: string, channelId: number, uId: number) {
  return requestHelper('POST', '/channel/addowner/v2', { channelId, uId }, token);
}
export function channelRemoveOwner(token: string, channelId: number, uId: number) {
  return requestHelper('POST', '/channel/removeowner/v2', { channelId, uId }, token);
}
// ===============================================================================================//
export function messageSend(token: string, channelId: number, message: string) {
  return requestHelper('POST', '/message/send/v2', { channelId, message }, token);
}
export function messageEdit(token: string, messageId: number, message: string) {
  return requestHelper('PUT', '/message/edit/v2', { messageId, message }, token);
}
export function messageRemove(token: string, messageId: number) {
  return requestHelper('DELETE', '/message/remove/v2', { messageId }, token);
}
export function messageShare(token: string, ogMessageId: number, message: string, channelId: number, dmId: number) {
  return requestHelper('POST', '/message/share/v1', { ogMessageId, message, channelId, dmId }, token);
}
export function messageReact(token: string, messageId: number, reactId: number) {
  return requestHelper('POST', '/message/react/v1', { messageId, reactId }, token);
}
export function messageUnreact(token: string, messageId: number, reactId: number) {
  return requestHelper('POST', '/message/unreact/v1', { messageId, reactId }, token);
}
export function messagePin(token: string, messageId: number) {
  return requestHelper('POST', '/message/pin/v1', { messageId }, token);
}
export function messageUnpin(token: string, messageId: number) {
  return requestHelper('POST', '/message/unpin/v1', { messageId }, token);
}
export function messageSendlater(token: string, channelId: number, message: string, timeSent: number) {
  return requestHelper('POST', '/message/sendlater/v1', { channelId, message, timeSent }, token);
}
export function messageSendlaterdm(token: string, dmId: number, message: string, timeSent: number) {
  return requestHelper('POST', '/message/sendlaterdm/v1', { dmId, message, timeSent }, token);
}
// ===============================================================================================//
export function dmCreate(token: string, uIds: Array<number>) {
  return requestHelper('POST', '/dm/create/v2', { uIds }, token);
}
export function dmList(token: string) {
  return requestHelper('GET', '/dm/list/v2', {}, token);
}
export function dmRemove(token: string, dmId: number) {
  return requestHelper('DELETE', '/dm/remove/v2', { dmId }, token);
}
export function dmDetails(token: string, dmId: number) {
  return requestHelper('GET', '/dm/details/v2', { dmId }, token);
}
export function dmLeave(token: string, dmId: number) {
  return requestHelper('POST', '/dm/leave/v2', { dmId }, token);
}
export function dmMessages(token: string, dmId: number, start: number) {
  return requestHelper('GET', '/dm/messages/v2', { dmId, start }, token);
}
export function messageSendDm(token: string, dmId: number, message: string) {
  return requestHelper('POST', '/message/senddm/v2', { dmId, message }, token);
}
// ===============================================================================================//
export function usersAll(token: string) {
  return requestHelper('GET', '/users/all/v2', {}, token);
}
export function userSetName(token: string, nameFirst: string, nameLast: string) {
  return requestHelper('PUT', '/user/profile/setname/v2', { nameFirst, nameLast }, token);
}
export function userSetEmail(token: string, email: string) {
  return requestHelper('PUT', '/user/profile/setemail/v2', { email }, token);
}
export function userSetHandle(token: string, handleStr: string) {
  return requestHelper('PUT', '/user/profile/sethandle/v2', { handleStr }, token);
}
// ============================ New Iteration 3 function wrappers ================================//
export function getNotifications(token: string) {
  return requestHelper('GET', '/notifications/get/v1', {}, token);
}
export function standupStart(token: string, channelId: number, length: number) {
  return requestHelper('POST', '/standup/start/v1', { channelId, length }, token);
}
export function standupActive(token: string, channelId: number) {
  return requestHelper('GET', '/standup/active/v1', { channelId }, token);
}
export function standupSend(token: string, channelId: number, message: string) {
  return requestHelper('POST', '/standup/send/v1', { channelId, message }, token);
}
export function adminUserRemove(token: string, uId: number) {
  return requestHelper('DELETE', '/admin/user/remove/v1', { uId }, token);
}
export function adminUserpermissionChange(token: string, uId: number, permissionId: number) {
  return requestHelper('POST', '/admin/userpermission/change/v1', { uId, permissionId }, token);
}
export function search(token: string, queryStr: string) {
  return requestHelper('GET', '/search/v1', { queryStr }, token);
}
// ======================================================================================
export function authPasswordRequest(email: string) {
  return requestHelper('POST', '/auth/passwordreset/request/v1', { email });
}

export function authPasswordReset(resetCode: string, newPassword: string) {
  return requestHelper('POST', '/auth/passwordreset/reset/v1', { resetCode, newPassword });
}