// YOU SHOULD MODIFY THIS OBJECT BELOW

let data = {
  users: [
    {
      uId: 1,
      nameFirst: 'Peter',
      nameLast: 'File',
      email: 'p.file@email.com',
      handleStr: 'filepeter',
    },
  ],

  channels: [
    {
      channelId: 1,
      name: "Peter's Channel",
      isPublic: true,
      ownerIds: [],
      memberIds: [],
      channelmessages: [
      	{
					messageId: undefined,
					uId: undefined,
					message: '',
					timeSent: undefined,
      	}
      	
    	],
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
function getData() {
  return data;
}

// Use set(newData) to pass in the entire data object, with modifications made
function setData(newData) {
  data = newData;
}

export { getData, setData };
