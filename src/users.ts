import { getData, setData } from './dataStore';
import { isValidToken } from './global';
import { validName, validEmail, anotherUserEmail } from './global';

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

function userProfileV2(token: string, uId: number) {
  const data = getData();

  if (!isValidToken(token)) {
    return { error: 'error' };
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
  return { error: 'error' };
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

function usersAllV1(token: string) {
  const data = getData();

  if (!isValidToken(token)) {
    return { error: 'error' };
  }

  const userArr = [];
  for (const user of data.users) {
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

function userSetNameV1(token: string, nameFirst: string, nameLast: string) {
  const data = getData();

  // Invalid cases: nameFirst & nameLast > 50 || < 1, invalid token
  if (!validName(nameFirst) || !validName(nameLast) || !isValidToken(token)) {
    return { error: 'error' };
  }

  // change nameFirst and nameLast
  for (const user of data.users) {
    if (user.tokens.includes(token)) {
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

function userSetEmailV1(token: string, email: string) {
  const data = getData();
  if (!isValidToken(token) || !validEmail(email) || anotherUserEmail(token, email)) {
    return { error: 'error' };
  }

  // change email
  for (const user of data.users) {
    if (user.tokens.includes(token)) {
      user.email = email;
      break;
    }
  }

  setData(data);
  return {};
}

export { userProfileV2, usersAllV1, userSetNameV1, userSetEmailV1 };
