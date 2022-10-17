import { getData, setData } from './dataStore';
import { isValidUser, getUserId, isValidToken } from './global';

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

function channelsCreateV2(token: string, name: string, isPublic: boolean) {
  const data = getData();

  if (!isValidToken(token)) {
    return { error: 'error' };
  }

  const authUserId = getUserId(token);

  if (!isValidUser(authUserId)) {
    return { error: 'error' };
  }

  // checking if name is valid
  if (name.length > 20 || name.length < 1) { return { error: 'error' }; }

  // setting channel values and pushing channel into dataStore
  data.channels.push({
    channelId: data.channels.length,
    name: name,
    isPublic: isPublic,
    ownerIds: [authUserId],
    memberIds: [authUserId],
    channelmessages: [],
  });

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

function channelsListV2(token: string) {
  const data = getData();

  if (!isValidToken(token)) {
    return { error: 'error' };
  }

  const authUserId = getUserId(token);

  if (!isValidUser(authUserId)) {
    return { error: 'error' };
  }

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

function channelsListAllV2(token: string) {
  const data = getData();

  if (!isValidToken(token)) {
    return { error: 'error' };
  }

  const authUserId = getUserId(token);

  if (!isValidUser(authUserId)) {
    return { error: 'error' };
  }

  const array = [];

  for (const ch of data.channels) {
    array.push({
      channelId: ch.channelId,
      name: ch.name,
    });
  }

  return {
    channels: array
  };
}

export {
  channelsCreateV2,
  channelsListV2,
  channelsListAllV2
};
