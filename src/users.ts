import { getData, setData } from './dataStore';
import { getUserId, isValidToken } from './global';
import {
  validName, validEmail, anotherUserEmail, alphanumeric,
  isValidHandleLength, anotherUserHandle, hashOf
} from './global';
import HTTPError from 'http-errors';
// import { arrayBuffer } from 'stream/consumers';
// import { channel } from 'diagnostics_channel';

/**
  * For a valid user, returns information about their user ID, email,
  * first name, last name, and handle
  *
  * @param {string} token - a valid token
  * @param {integer} uId - a valid uId from dataStore
  *
  * @returns {Object {uId: integer, email: string, nameFirst: string,
 * nameLast: string, handleStr: string} } - object user details
 *
 * @returns {error} - return error object in invalid cases
*/

function userProfileV3(token: string, uId: number) {
  const data = getData();

  if (!isValidToken(token)) {
    throw HTTPError(403, 'Invalid token');
  }

  for (const user of data.users) {
    if (uId === user.uId) {
      return {
        user: {
          uId: uId,
          email: user.email,
          nameFirst: user.nameFirst,
          nameLast: user.nameLast,
          handleStr: user.handleStr,
        }
      };
    }
  }
  throw HTTPError(400, 'Invalid uId');
}

/**
  * Returns a list of all users and their associated details.
  *
  * @param {string} token - a valid token
  *
  * @returns {Array<user>: {uId: integer, email: string, nameFirst: string,
 * nameLast: string, handleStr: string} } - object user details
 *
 * @returns {error} - return error object in invalid cases
*/

function usersAllV2(token: string) {
  const data = getData();

  if (!isValidToken(token)) {
    throw HTTPError(403, 'Invalid token');
  }

  const userArr = [];
  for (const user of data.users) {
    if (user.isRemoved) {
      continue;
    }
    userArr.push({
      uId: user.uId,
      email: user.email,
      nameFirst: user.nameFirst,
      nameLast: user.nameLast,
      handleStr: user.handleStr,
    });
  }

  return { users: userArr };
}

/**
  * Updates the authorised user's first and last name.
  *
  * @param {string} token - a valid token
  * @param {string} nameFirst - a valid nameFirst
  * @param {string} nameLast - a valid nameLast
  *
  * @returns {} - empty object
 *
 * @returns {error} - return error object in invalid cases
*/

function userSetNameV2(token: string, nameFirst: string, nameLast: string) {
  const data = getData();
  // invalid token
  if (!isValidToken(token)) {
    throw HTTPError(403, 'Invalid token');
  }
  // Invalid cases: nameFirst & nameLast > 50 || < 1
  if (!validName(nameFirst) || !validName(nameLast)) {
    throw HTTPError(400, 'Invalid nameFirst/nameLast');
  }

  // change nameFirst and nameLast
  for (const user of data.users) {
    if (user.tokens.includes(hashOf(token))) {
      user.nameFirst = nameFirst;
      user.nameLast = nameLast;
      break;
    }
  }

  setData(data);
  return {};
}

/**
  * Update the authorised user's email address
  *
  * @param {string} token - a valid token
  * @param {string} email - a valid email
  *
  * @returns {} - empty object
 *
 * @returns {error} - return error object in invalid cases
*/

function userSetEmailV2(token: string, email: string) {
  const data = getData();
  if (!isValidToken(token)) {
    throw HTTPError(403, 'Invalid token');
  } else if (!validEmail(email) || anotherUserEmail(token, email)) {
    throw HTTPError(400, 'Invalid email');
  }

  // change email
  for (const user of data.users) {
    if (user.tokens.includes(hashOf(token))) {
      user.email = email;
      break;
    }
  }

  setData(data);
  return {};
}

/**
  * Update the authorised user's handle (i.e. display name)
  *
  * @param {string} token - a valid token
  * @param {string} handleStr - a valid handle string
  *
  * @returns {} - empty object
 *
 * @returns {error} - return error object in invalid cases
*/

function userSetHandleV2(token: string, handleStr: string) {
  const data = getData();
  // invalid token, length of handleStr, non-alphanumeric, handle already in use
  if (!isValidToken(token)) {
    throw HTTPError(403, 'Invalid token');
  } else if (!alphanumeric(handleStr) || !isValidHandleLength(handleStr) ||
    anotherUserHandle(token, handleStr)) {
    throw HTTPError(400, 'Invalid handleStr');
  }

  // change handle
  for (const user of data.users) {
    if (user.tokens.includes(hashOf(token))) {
      user.handleStr = handleStr;
      break;
    }
  }

  setData(data);
  return {};
}

function userStatsV1(token: string) {
  const data = getData();
  // invalid token
  if (!isValidToken(token)) {
    throw HTTPError(403, 'Invalid token');
  }

  const uId = getUserId(token);

  // Calculating involvement
  // sum(numChannelsJoined, numDmsJoined, numMsgsSent) / sum(numChannels, numDms, numMsgs)
  const denom = data.channels.length + data.dms.length + data.workspaceStats.messagesExist.length - 1;
  let involvement = 0;
  // Calculating involvement if denom != 0
  if (denom) {
    // Finding number of involved channels, dms and msgs sent
    // Finding length of each array in userStatus
    const chLength = data.users[uId].userStats.channelsJoined.length - 1;
    const dmsLength = data.users[uId].userStats.dmsJoined.length - 1;
    const msgsLength = data.users[uId].userStats.messagesSent.length - 1;
    // Finding value of latest element in each array in userStatus
    const chFinal = data.users[uId].userStats.channelsJoined[chLength].numChannelsJoined;
    const dmsFinal = data.users[uId].userStats.dmsJoined[dmsLength].numDmsJoined;
    const msgsFinal = data.users[uId].userStats.messagesSent[msgsLength].numMessagesSent;

    const numer = chFinal + dmsFinal + msgsFinal;
    involvement = numer / denom;
  }

  // Setting involvement to 1 if greater than 1
  if (involvement > 1) {
    involvement = 1;
  }

  const obj = {
    channelsJoined: data.users[uId].userStats.channelsJoined,
    dmsJoined: data.users[uId].userStats.dmsJoined,
    messagesSent: data.users[uId].userStats.messagesSent,
    involvementRate: involvement,
  };
  return obj;
}

function usersStatsV1 (token: string) {
  const data = getData();

  // Finding utilisation rate
  // Finding the number of users who have joined at least one channel or dm
  const numusers = data.users.length;
  let usersJ = 0;
  for (const members of data.users) {
    if (members.userStats.channelsJoined.length > 1 || members.userStats.dmsJoined.length > 1) {
      usersJ++;
    }
  }
  // Caclulating utilisation rate
  // numUsersWhoHaveJoinedAtLeastOneChannelOrDm / numUsers
  const util = usersJ / numusers;

  const obj = {
    channelsExist: data.workspaceStats.channelsExist,
    dmsExist: data.workspaceStats.dmsExist,
    messagesExist: data.workspaceStats.messagesExist,
    utilizationRate: util,
  };
  return obj;
}

export { userProfileV3, usersAllV2, userSetNameV2, userSetEmailV2, userSetHandleV2, userStatsV1, usersStatsV1 };
