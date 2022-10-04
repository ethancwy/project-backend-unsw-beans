import { getData, setData } from '../dataStore.js';

/**
  *
  * Creates a new channel with the given name, that is either a public or 
  * private channel. The user who created it automatically joins the channel.
  * 
  * @param {integer} authUserId - a valid authUserId from dataStore
  * @param {string} name - a valid name that is greater than 1 and smaller than 20
  * @param {boolean} isPublic - deciding factor for setting if channel should be public
  * ...
  * 
  * @returns {integer} - channelId of the channel created
*/

function channelsCreateV1(authUserId, name, IsPublic) {
  let data = getData();

  //checking if authUserId is valid
  let user_is_valid = false;
  for (const user of data.users) {
    if (user.uId === authUserId) {
      user_is_valid = true;
      break;
    }
  }
  if (!(user_is_valid))
    return { error: 'error' };

  //checking if name is valid
  if (name.length > 20 || name.length < 1)
    return { error: 'error' };

  //setting channel values and pushing channel into dataStore
  if (data.channels[0].channelId === NaN && data.channels.length === 1) {
    data.channels[0].channelId = data.channels.length - 1;
    data.channels[0].name = name;
    data.channels[0].isPublic = isPublic;
    data.channels[0].ownerIds.push(authUserId);
    data.channels[0].memberIds.push(authUserId);
  }
  else {
    data.channels.push({
      channelId: data.channels.length,
      name: name,
      isPublic: IsPublic,
      ownerIds: [authUserId],
      memberIds: [authUserId],
    });
  }

  setData(data);
  return { channelId: data.channels[data.channels.length - 1].channelId };
}

/**
  *
  * Provides an array of all channels (and their associated details) that the authorised user is part of
  * 
  * @param {integer} authUserId - a valid userId in dataStore
  * ...
  * 
  * @returns {channels: 
  *             channelId:
  *             name:
  *           } - if authuserId is valid
  * 
*/

function channelsListV1(authUserId) {
  let data = getData();

  //checking if authUserId is valid
  let user_is_valid = false;
  for (const user of data.users) {
    if (user.uId === authUserId) {
      user_is_valid = true;
      break;
    }
  }
  if (!(user_is_valid))
    return { error: 'error' };

  const channel_list = [];

  for (const ch of data.channels) {
    for (const member of ch.memberIds) {
      if (authUserId === member) {
        channel_list.push({
          channelId: ch.channelId,
          name: ch.name,
        });
        break;
      }
    }
  }

  return { channels: channel_list };
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