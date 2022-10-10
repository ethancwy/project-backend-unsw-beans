// YOU SHOULD MODIFY THIS OBJECT BELOW
type typedata = {
  users: [
    {
      uId: number,
      nameFirst: string,
      nameLast: string,
      email: string,
      password: string,
      handleStr: string,
      isGlobalOwner: boolean,
    },
  ],

  channels: [
    {
      channelId: number,
      name: string,
      isPublic: boolean,
      ownerIds: [],
      memberIds: [],
      channelmessages: [
        {
          messageId: number,
          uId: number,
          message: string,
          timeSent: number,
        }
      ]
    },
  ],
}; 

let data = {
  users: [
    {
      uId: NaN,
      nameFirst: '',
      nameLast: '',
      email: '',
      password: '',
      handleStr: '',
      isGlobalOwner: false,
    },
  ],

  channels: [
    {
      channelId: NaN,
      name: '',
      isPublic: false,
      ownerIds: [],
      memberIds: [],
      channelmessages: [
        {
          messageId: NaN,
          uId: NaN,
          message: '',
          timeSent: NaN,
        }
      ]
    },
  ],
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
function getData(): typedata {
  return data;
}

// Use set(newData) to pass in the entire data object, with modifications made
function setData(newData: typedata) {
  data = newData;
}

export { getData, setData };