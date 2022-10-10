import { getData, setData } from './datastore.ts';

export type authUserId = { authUserId: number };

export type channelId = { channelId: number };

export type error = { error: string };

export type channels = { 
  channels: { 
    channelId: number,
    name: string 
  } 
};

export type user = {
    uId: number;
    email: string;
    nameFirst: string;
    nameLast: string;
    handleStr: string;
};


// Helper function to check if user is valid
export function isValidUser(authUserId: number): boolean {
  const data = getData();
  for (const user of data.users) {
    if (authUserId === user.uId) {
      return true;
    }
  }
  return false;
}

// Helper function to check if channel is valid
export function isValidChannel(channelId: number): boolean {
  const data = getData();
  for (const channel of data.channels) {
    if (channelId === channel.channelId) {
      return true;
    }
  }
  return false;
}

// Helper function to check if user is valid
export function isGlobalOwner(authUserId: number): boolean {
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