import { getData } from './dataStore';
import { isValidToken } from './global';

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

function usersAllV1(token: string) {
  const data = getData();

  if (!isValidToken(token)) {
    return { error: 'error' };
  }

  let userArr = [];
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

export { userProfileV2, usersAllV1 };
