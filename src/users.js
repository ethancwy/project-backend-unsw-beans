import { getData, setData } from './dataStore.js'

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

  let user = isValidUser(uId);

  if (!user || !isValidUser(authUserId)) {
    return { error: 'error' };
  }

  if (uId === user.uId) {
    return {
      uId: uId,
      email: user.email,
      nameFirst: user.nameFirst,
      nameLast: user.nameLast,
      handleStr: user.handleStr,
    }
  }
}

// Helper function to check if user is valid
function isValidUser(userId) {
  const data = getData();
  for (const user of data.users) {
    if (userId === user.uId) {
      return user;
    }
  }

  return false;
}

export { userProfileV1 };