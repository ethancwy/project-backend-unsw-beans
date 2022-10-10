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