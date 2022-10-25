import fs from 'fs';

// YOU SHOULD MODIFY THIS OBJECT BELOW
type user = {
  uId: number;
  nameFirst: string;
  nameLast: string;
  email: string;
  password: string;
  handleStr: string;
  isGlobalOwner: boolean;
  tokens: Array<string>;
}

type message = {
  messageId: number;
  uId: number;
  message: string;
  timeSent: number;
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
