import fs from 'fs';

type user = {
  uId: number;
  nameFirst: string;
  nameLast: string;
  email: string;
  password: string;
  handleStr: string;
  isGlobalOwner: boolean;
  tokens: Array<string>;
  profileImgUrl?: string;
}

export type Reacts = {
  reactId: number;
  uIds: Array<number>;
  isThisUserReacted: boolean;
}

export type reactions = {
  reactId: number;
  uIds: Array<number>;
}

type message = {
  messageId: number;
  uId: number;
  message: string;
  timeSent: number;
  reacts: Array<reactions>;
  isPinned: boolean;
  tags: Array<number>;
}

type channel = {
  channelId: number;
  name: string;
  isPublic: boolean;
  ownerIds: Array<number>;
  memberIds: Array<number>;
  channelmessages: Array<message>;
}

type dm = {
  dmId: number;
  name: string;
  owner: number;
  members: Array<number>;
  messages: Array<message>;
}

export type details = {
  uId: number;
  messageId: number;
  isDm: boolean;
  listId: number;
}
//= =========ITERATION 3==========//
export type ChannelsJoined = {
  numChannelsJoined: number;
  timeStamp: number;
}
export type DmsJoined = {
  numDmsJoined: number;
  timeStamp: number;
}
export type MessagesSent = {
  numMessagesSent: number;
  timeStamp: number;
}

export type userStats = {
  channelsJoined: ChannelsJoined;
  dmsJoined: DmsJoined;
  messagesSent: MessagesSent;
  involvementRate: number;
  // ^ sum(numChannelsJoined, numDmsJoined, numMsgsSent) /
  // sum(numChannels, numDms, numMsgs)
}

export type ChannelsExist = {
  numChannelsExist: number;
  timeStamp: number;
}

export type DmsExist = {
  numDmsExist: number;
  timeStamp: number;
}

export type MessagesExist = {
  numMessagesExist: number;
  timeStamp: number;
}

export type workspaceStats = {
  channelsExist: ChannelsExist;
  dmsExist: DmsExist;
  messagesExist: MessagesExist;
  utilizationRate: number;
  // ^ numUsersWhoHaveJoinedAtLeastOneChannelOrDm / numUsers
}

export type Notifications = {
  channelId: number;
  dmId: number;
  notificationMessage: string;
  /*
  notificationMessage is a string of the following format for each trigger action:

  tagged: "{User’s handle} tagged you in {channel/DM name}: {first 20 characters of the message}"
  reacted message: "{User’s handle} reacted to your message in {channel/DM name}"
  added to a channel/DM: "{User’s handle} added you to {channel/DM name}"
  */
}

export type datatype = {
  users: Array<user>;
  channels: Array<channel>;
  dms: Array<dm>;
  sessionIds: Array<string>;
  messageDetails: Array<details>;
}

let data: datatype = {
  users: [
    // {
    //   uId: NaN,
    //   nameFirst: '',
    //   nameLast: '',
    //   email: '',
    //   password: '',
    //   handleStr: '',
    //   isGlobalOwner: false,
    //   tokens: [],
    // },
  ],

  channels: [
    // {
    //   channelId: NaN,
    //   name: '',
    //   isPublic: false,
    //   ownerIds: [],
    //   memberIds: [],
    //   channelmessages: [
    //     {
    //       messageId: NaN,
    //       uId: NaN,
    //       message: '',
    //       timeSent: NaN,
    //     }
    //   ]
    // },
  ],

  dms: [
    // {
    //   dmId: number;
    //   name: string;
    //   owner: number;
    //   members: [];
    //   messages: [];
    // }
  ],

  sessionIds: [],
  messageDetails: [],
};

// YOU SHOULDNT NEED TO MODIFY THE FUNCTIONS BELOW IN ITERATION 1

/*
Example usage
    let store = getData()
    console.log(store) # Prints { 'names': ['Hayden', 'Tam', 'Rani', 'Giuliana', 'Rando'] }

    names = store.names

    names.pop()
    names.push('Jake')

    console.log(store) # Prints { 'names': ['Hayden', 'Tam', 'Rani', 'Giuliana', 'Jake'] }
    setData(store)
*/

// Use get() to access the data
function getData() {
  if (fs.existsSync('./database.json')) {
    const dbstr = fs.readFileSync('./database.json', { flag: 'r' });
    return JSON.parse(String(dbstr));
  }

  return data;
}

// Use set(newData) to pass in the entire data object, with modifications made
function setData(newData: datatype) {
  data = newData;
  const dataStr = JSON.stringify(data, null, 2);
  fs.writeFileSync('./database.json', dataStr, { flag: 'w' });
}

export { getData, setData };
