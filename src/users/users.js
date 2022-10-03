import { getData, setData } from '../dataStore'

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

  if (!isValidUser(uId) || !isValidUser(authUserId)) {
    return { error: 'error' };
  }

  return {
    uId: uId.authUserId,
    email: uId.email,
    nameFirst: uId.nameFirst,
    nameLast: uId.nameLast,
    handleStr: uId.handleStr,
  }
}

// Helper function to check if user is valid
function isValidUser(userId) {
  const data = getData();
  for (const user of data.users) {
    if (userId.authUserId === user.uId) {
      return true;;
    }
  }
  return false;
}

export { userProfileV1 };