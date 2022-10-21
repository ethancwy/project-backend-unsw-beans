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

type channelmessages = {
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
  channelmessages: Array<channelmessages>;
}

type dm = {
  dmId: number;
  name: string;
  owner: number;
  members: Array<number>;
  messages: Array<channelmessages>;
}

type datatype = {
  users: Array<user>;
  channels: Array<channel>;
  dms: Array<dm>;
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

  ]
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
  return data;
}

// Use set(newData) to pass in the entire data object, with modifications made
function setData(newData: datatype) {
  data = newData;
}

export { getData, setData };

// import fs from 'fs';
// import { getData } from './dataStore'

// let data = getData();

// if (fs.existsSync('./database.json')) {
//   const dbstr = fs.readFileSync('./database.json');
//   data = JSON.parse(String(dbstr));
// }

// const save = () => {
//   const jsonstr = JSON.stringify(data);
//   fs.writeFileSync('./database.json', jsonstr);
// }