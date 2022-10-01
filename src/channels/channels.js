import { authLoginV1, authRegisterV1 } from '../auth/auth.js';
import { clearV1 } from '../other/other.js';
import { getData, setData } from '../dataStore.js';


function channelsCreateV1(authUserId, name, IsPublic) {
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

  //checking if name is valid
  if ( name.length > 20 || name.length < 1 )
    return { error: 'error' };

  //setting channel values and pushing channel into dataStore
  if ( data.channels[0].channelId === NaN && data.channels.length === 1 ) {
    data.channels[0].channelId = data.channels.length + 1;
    data.channels[0].name = name;
    data.channels[0].isPublic = isPublic;
    data.channels[0].ownerIds.push(authUserId);
    data.channels[0].memberIds.push(authUserId);
  }
  else {
    data.channels.push({ 
      channelId: data.channels.length + 1,
      name: name,
      isPublic: IsPublic,
      ownerIds: [authUserId],
      memberIds: [authUserId],
  });
}

  return { channelId: data.channels.length };
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
