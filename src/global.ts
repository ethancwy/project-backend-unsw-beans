import { getData } from './dataStore';
import request, { HttpVerb } from 'sync-request';
import { port, url } from './config.json';
const SERVER_URL = `${url}:${port}`;

const OK = 200;

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

// Helper function to check if user is valid
export function isValidUser(authUserId: number) {
  const data = getData();
  for (const user of data.users) {
    if (authUserId === user.uId) {
      return true;
    }
  }
  return false;
}

// Helper function to check if channel is valid
export function isValidChannel(channelId: number) {
  const data = getData();
  for (const channel of data.channels) {
    if (channelId === channel.channelId) {
      return true;
    }
  }
  return false;
}

// Helper function to check if user is global owner
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

// ================================ WRAPPER HELPER FUNCTIONS ============================== //

export function requestHelper(method: HttpVerb, path: string, payload: object) {
  let qs = {};
  let json = {};
  if (['GET', 'DELETE'].includes(method)) {
    qs = payload;
  } else {
    // PUT/POST
    json = payload;
  }

  const res = request(method, SERVER_URL + path, { qs, json });
  expect(res.statusCode).toBe(OK);
  return JSON.parse(res.getBody() as string);
}

// ============================ Iteration 1 function wrappers ================================//
export function authLogin(email: string, password: string) {
  return requestHelper('POST', '/auth/login/v2', { email, password });
}
export function authRegister(email: string, password: string, nameFirst: string, nameLast: string) {
  return requestHelper('POST', '/auth/register/v2', { email, password, nameFirst, nameLast });
}
// ===========================================================================================//
export function channelsCreate(token: string, name: string, isPublic: boolean) {
  return requestHelper('POST', '/channels/create/v2', { token, name, isPublic });
}
export function channelsList(token: string) {
  return requestHelper('GET', '/channels/list/v2', { token });
}
export function channelsListAll(token: string) {
  return requestHelper('GET', '/channels/listall/v2', { token });
}
// ===========================================================================================//
export function channelDetails(token: string, channelId: number) {
  return requestHelper('GET', '/channel/details/v2', { token, channelId });
}
export function channelJoin(token: string, channelId: number) {
  return requestHelper('POST', '/channel/join/v2', { token, channelId });
}
export function channelInvite(token: string, channelId: number, uId: number) {
  return requestHelper('POST', '/channel/invite/v2', { token, channelId, uId });
}
export function channelMessages(token: string, channelId: number, start: number) {
  return requestHelper('GET', '/channel/messages/v2', { token, channelId, start });
}
// ===========================================================================================//
export function userProfile(token: string, uId: number) {
  return requestHelper('GET', '/user/profile/v2', { token, uId });
}
// ===========================================================================================//
export function clear() {
  return requestHelper('DELETE', '/clear/v1', {});
}

// ============================ New Iteration 2 function wrappers ================================//
export function authLogout(token: string) {
  return requestHelper('POST', '/auth/logout/v1', { token });
}
// ===============================================================================================//
export function channelLeave(token: string, channelId: number) {
  return requestHelper('POST', '/channel/leave/v1', { token, channelId });
}
export function channelAddOwner(token: string, channelId: number, uId: number) {
  return requestHelper('POST', '/channel/addowner/v1', { token, channelId, uId });
}
export function channelRemoveOwner(token: string, channelId: number, uId: number) {
  return requestHelper('POST', '/channel/removeowner/v1', { token, channelId, uId });
}
// ===============================================================================================//
export function messageSend(token: string, channelId: number, message: string) {
  return requestHelper('POST', '/message/send/v1', { token, channelId, message });
}
export function messageEdit(token: string, messageId: number, message: string) {
  return requestHelper('PUT', '/message/edit/v1', { token, messageId, message });
}
export function messageRemove(token: string, messageId: number) {
  return requestHelper('DELETE', '/message/remove/v1', { token, messageId });
}
// ===============================================================================================//
export function dmCreate(token: string, uIds: Array<number>) {
  return requestHelper('POST', '/dm/create/v1', { token, uIds });
}
export function dmList(token: string) {
  return requestHelper('GET', '/dm/list/v1', { token });
}
export function dmRmove(token: string, dmId: number) {
  return requestHelper('DELETE', '/dm/remove/v1', { token, dmId });
}
export function dmDetails(token: string, dmId: number) {
  return requestHelper('GET', '/dm/details/v1', { token, dmId });
}
export function dmLeave(token: string, dmId: number) {
  return requestHelper('POST', '/dm/leave/v1', { token, dmId });
}
export function dmMessages(token: string, dmId: number, start: number) {
  return requestHelper('GET', '/dm/messages/v1', { token, dmId, start });
}
export function messageSendDm(token: string, dmId: number, message: string) {
  return requestHelper('POST', '/dm/messages/v1', { token, dmId, message });
}
// ===============================================================================================//
export function usersAll(token: string) {
  return requestHelper('GET', '/users/all/v1', { token });
}
export function userSetName(token: string, nameFirst: string, nameLast: string) {
  return requestHelper('PUT', '/user/profile/setname/v1', { token, nameFirst, nameLast });
}
export function userSetEmail(token: string, email: string) {
  return requestHelper('PUT', '/user/profile/setemail/v1', { token, email });
}
export function userSetHandle(token: string, handleStr: string) {
  return requestHelper('PUT', '/user/profile/sethandle/v1', { token, handleStr });
}
