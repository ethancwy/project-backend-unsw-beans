import { getData, setData } from './dataStore.ts'
import { user, error } from './global.ts'

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

function userProfileV1(authUserId: number, uId: number): user | error {
  const data = getData();

  let user = isValidUser(uId);

  if (!user || !isValidUser(authUserId)) {
    return { error: 'error' };
  }

  if (uId === user.uId) {
    return {
      user: {
        uId: uId,
        email: user.email,
        nameFirst: user.nameFirst,
        nameLast: user.nameLast,
        handleStr: user.handleStr,
      }
    }
  }
}

// Helper function to check if user is valid
function isValidUser(userId: number): boolean {
  const data = getData();
  for (const user of data.users) {
    if (userId === user.uId) {
      return user;
    }
  }
  return false;
}

export { userProfileV1 };