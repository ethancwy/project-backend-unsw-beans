import { getData, setData } from '../dataStore'

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