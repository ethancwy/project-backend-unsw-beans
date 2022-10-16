import { getData } from './dataStore';
import request, { HttpVerb } from 'sync-request';
import { port, url } from './config.json';
const SERVER_URL = `${url}:${port}`;

const OK = 200;

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

// Helper function post request
export function postRequest(url: string, data: any) {
  const res = request(
    'POST',
    url,
    {
      json: data,
    }
  );
  const bodyObj = JSON.parse(res.getBody() as string);
  expect(res.statusCode).toBe(OK);
  return bodyObj;
}

// Helper function get request
export function getRequest(url: string, data: any) {
  const res = request(
    'GET',
    url,
    {
      qs: data,
    }
  );
  const bodyObj = JSON.parse(res.getBody() as string);
  expect(res.statusCode).toBe(OK);
  return bodyObj;
}

// Helper function delete request
export function deleteRequest(url: string, data: any) {
  const res = request(
    'DELETE',
    url,
    {
      qs: data,
    }
  );
  const bodyObj = JSON.parse(res.getBody() as string);
  expect(res.statusCode).toBe(OK);
  return bodyObj;
}

export function requestHelper(method: HttpVerb, path: string, payload: object) {
  let qs = {};
  let json = {};
  if (['GET', 'DELETE'].includes(method)) {
    qs = payload;
  } else {
    // PUT/POST
    json = payload;
  }
  //const headers = { token: token };
  const res = request(method, SERVER_URL + path, { qs, json });
  return JSON.parse(res.getBody() as string);
}
