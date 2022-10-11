import { getData } from './dataStore';
import { isValidUser } from './global';
import { user, error } from './global';

/**
  * For a valid user, returns information about their user ID, email,
  * first name, last name, and handle
  *
  * @param {integer} authUserId - a valid authUserId from dataStore
  * @param {integer} uId - a valid uId from dataStore
  *
  * @returns {Object {uId: integer, email: string, nameFirst: string,
 * nameLast: string, handleStr: string} } - object user details
 *
 * @returns {error} - return error object in invalid cases
*/

function userProfileV1(authUserId, uId) {
  const data = getData();

  if (!isValidUser(authUserId)) {
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

export { userProfileV1 };
