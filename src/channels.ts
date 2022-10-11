import { getData, setData } from './dataStore';
import { channels, channelId, error } from './global';

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

function channelsCreateV1(authUserId: number, name: string, isPublic: boolean): channelId | error {
  const data = getData();

  // checking if authUserId is valid
  let userIsValid = false;
  for (const user of data.users) {
    if (user.uId === authUserId) {
      userIsValid = true;
      break;
    }
  }
  if (!(userIsValid)) { return { error: 'error' }; }

  // checking if name is valid
  if (name.length > 20 || name.length < 1) { return { error: 'error' }; }

  // setting channel values and pushing channel into dataStore
  if (isNaN(data.channels[0].channelId) && data.channels.length === 1) {
    data.channels[0].channelId = 0;
    data.channels[0].name = name;
    data.channels[0].isPublic = isPublic;
    data.channels[0].ownerIds.push(authUserId);
    data.channels[0].memberIds.push(authUserId);
  } else {
    data.channels.push({
      channelId: data.channels.length,
      name: name,
      isPublic: isPublic,
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

function channelsListV1(authUserId: number): channels[] | error {
  const data = getData();

  // checking if authUserId is valid
  let userIsValid = false;
  for (const user of data.users) {
    if (user.uId === authUserId) {
      userIsValid = true;
      break;
    }
  }
  if (!(userIsValid)) { return { error: 'error' }; }

  const channelList = [];

  for (const ch of data.channels) {
    for (const member of ch.memberIds) {
      if (authUserId === member) {
        channelList.push({
          channelId: ch.channelId,
          name: ch.name,
        });
        break;
      }
    }
  }

  return { channels: channelList };
}

/**
  *
  * Provides an array of all channels, including private channels (and their associated details)
  *
  * @param {integer} authUserId - a valid userId in dataStore
  * ...
  *
  * @returns {channels:
 *             channelId:
 *             name:
 *           } - if authUserId is valid
 *
*/

function channelsListAllV1(authUserId: number): channels[] | error {
  const data = getData();

  // checking if user exists
  let userCheck = 0;
  for (const user of data.users) {
    if (user.uId === authUserId) {
      userCheck = 1;
    }
  }

  if (userCheck === 0) {
    return authUserId + ' is invalid';
  }

  const array = [];

  for (const ch of data.channels) {
    if (!isNaN(ch.channelId)) {
      array.push({
        channelId: ch.channelId,
        name: ch.name,
      });
    }
  }

  return {
    channels: array
  };
}

export {
  channelsCreateV1,
  channelsListV1,
  channelsListAllV1
};
