import { authLoginV1, authRegisterV1 } from '../auth/auth.js';
import { clearV1 } from '../other/other.js';
import { getData, setData } from '../dataStore.js';


function channelsCreateV1(authUserId, name, IsPublic) {
  let data = getData();

  let user_is_valid = false;
  for ( const user of data.users ) {
    if ( user.uId ) {
      user_is_valid = true;
      break;
    }
  }

  if ( user_is_valid )

  let new_channel = {
    channelId: data.channels.length,
    name: name,
    isPublic: IsPublic,
  };
  data.channels.push({ new_channel });


  return new_channel;
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
