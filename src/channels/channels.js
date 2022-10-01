import { getData, setData } from '../dataStore.js';


function channelsCreateV1(authUserId, name, IsPublic) {
  return { channelId: 1 };
}


function channelsListV1(authUserId) {
  let data = getData();

  //checking if authUserId is valid
  let user_is_valid = false;
  for ( const user of data.users ) {
    if ( user.uId === authUserId ) {
      user_is_valid = true;
      break;
    }
  }
  if ( !(user_is_valid) )
    return { error: 'error' };

  for ( const ch of data.channels ) {
    if ( authUserId in ch.ownerIds )
      return {
        channelId: ch.channelId,
        name: name,
      };
  }
  

  return {
    channels: [
      {
      }
    ],
  }
}

function channelsListAllV1(authUserId) {
  return {
    channels: [
      {
        channelId: 1,
        name: 'My Channel',
      }
    ],
  };
}

export {
  channelsCreateV1,
  channelsListV1,
  channelsListAllV1
};
