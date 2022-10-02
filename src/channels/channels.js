import { getData, setData } from '../dataStore.js';

function channelsCreateV1(authUserId, name, IsPublic) {
  return {
    channelId: 1,
  }
}

function channelsListV1(authUserId) {
  return {
    channels: [
      {
        channelId: 1,
        name: "My Channel",
      }
    ],
  }
}

function channelsListAllV1(authUserId) {
  let data = getData();

  // checking if user exists
  let user_check = 0;
  for (const user in data.users) {
    if (user === authUserId) {
      user_check = 1;
    }
  }

  if (user_check === 0) {
    return authUserId + "is invalid";
  }

  // if there are currently no channels in existence
  /*if (data.channels.uId === 'NaN') {
    return {data.channels};
  }*/

  const array = [
    {
      channelId: 'NaN',
      name: 'NaN',
    },
  ];

  array.pop();
  
  for (const channels of array) {
   let temp_obj = {
    channelId: channels.channelId,
    name: channels.name,
   };

   array.push(temp_obj);
  }
  
  if (array == null) {
    return { [] };
  }

  return {
    array
  };
}

export {
  channelsCreateV1,
  channelsListV1,
  channelsListAllV1
};
