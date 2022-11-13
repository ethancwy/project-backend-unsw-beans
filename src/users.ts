import { getData, setData } from './dataStore';
import { isValidToken } from './global';
import {
  validName, validEmail, anotherUserEmail, alphanumeric,
  isValidHandleLength, anotherUserHandle, hashOf
} from './global';
import HTTPError from 'http-errors';

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

export { userProfileV3, usersAllV2, userSetNameV2, userSetEmailV2, userSetHandleV2 };
