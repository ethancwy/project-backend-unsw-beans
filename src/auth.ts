import { getData, setData } from './dataStore';
import { validEmail, validName, isValidToken } from './global';
import HTTPError from 'http-errors';

/**
* Allows user to login with email and password that they have registered
* returns a userId if valid and error if invalid
*
* @param {String} email - User enters a valid email address
* @param {String} password - User input password that is >= 6 characters long
*
* @returns {Object { authUserId: Number, token: String }} - Returns a valid authUserId and token
* @returns {{error: 'error'}} - on error
*/

function authLoginV3(email: string, password: string) {
  const data = getData();

  for (const user of data.users) {
    if (user.email === email) {
      if (user.password === password && !user.isRemoved) {
        const token = generateToken();
        user.tokens.push(token);
        data.sessionIds.push(token);
        setData(data);
        return { token: token, authUserId: user.uId };
      }
      throw HTTPError(400, 'Incorrect password');
    }
  }

  throw HTTPError(400, 'Email does not belong to user');
}

/**
  * Allows user to register with email, password, first name, and last name
  * returns a userId if valid
  *
  * @param {String} email - User enters a valid email address
  * @param {String} password - User input password that's >= 6 characters long
  * @param {String} nameFirst - User input name that's 1-50 characters long
  * @param {String} nameLast - User input name that's 1-50 characters long
  *
  * @returns {Object { authUserId: Number, token: String }} - Returns a valid authUserId and token
  * @returns {{error: 'error'}} - on error
*/

function authRegisterV3(email: string, password: string, nameFirst: string, nameLast: string) {
  const data = getData();

  if (!validEmail(email) || !validPass(password) || !validName(nameFirst) ||
    !validName(nameLast) || sameEmail(email)) {
    throw HTTPError(400, 'Something is invalid / same email as another user');
  }

  const handle = getHandleStr(nameFirst, nameLast);
  const handleStr = validHandle(handle);

  const token = generateToken();
  data.sessionIds.push(token);

  data.users.push({
    uId: data.users.length,
    nameFirst: nameFirst,
    nameLast: nameLast,
    email: email,
    password: password,
    handleStr: handleStr,
    isGlobalOwner: false,
    isRemoved: false,
    tokens: [token],
    userStats: {
      channelsJoined: [{numChannelsJoined: 0, timeStamp: 0}],
      dmsJoined: [{numDmsJoined: 0, timeStamp: 0}],
      messagesSent: [{numMessagesSent: 0, timeStamp: 0}],
      involvementRate: 0,
    },
  });

  if (data.users.length === 1) {
    data.users[0].isGlobalOwner = true;
  }

  setData(data);
  return { authUserId: data.users[data.users.length - 1].uId, token: token };
}

/**
  * Allows a user to logout when provided a valid token
  * returns nothing if valid
  *
  * @param {String} token - User enters a valid token
  *
  * @returns {{}} - Returns nothing if valid
  * @returns {{error: 'error'}} - on error
*/

function authLogoutV2(token: string) {
  const data = getData();

  if (!isValidToken(token)) {
    throw HTTPError(403, 'Invalid token');
  }

  for (const user of data.users) {
    for (const index in user.tokens) {
      if (user.tokens[index] === token) {
        user.tokens.splice(parseInt(index), 1);
        break;
      }
    }
  }

  data.sessionIds.splice(data.sessionIds.indexOf(token), 1);
  setData(data);
  return {};
}

function generateToken() {
  const data = getData();
  return String(data.sessionIds.length);
}

// Helper function to generate a valid handle string
function getHandleStr(nameFirst: string, nameLast: string) {
  // Given a first and last name
  // return a handle that concats together both names
  // without any uppercase, whitespace, and special characters
  const name1 = nameFirst.toLowerCase().replace(/[0-9]|\W/g, '');
  const name2 = nameLast.toLowerCase().replace(/[0-9]|\W/g, '');

  const result = name1.concat(name2);

  const handleStr = result.substring(0, 20);

  return handleStr;
}

// Helper function to get valid password
function validPass(password: string) {
  if (password.match(/.{6,}/)) {
    return true;
  } else {
    return false;
  }
}

// Helper function to get valid handle string
function validHandle(handle: string) {
  const data = getData();
  let tempHandle = handle;
  let suffix = 0;
  for (let i = 0; i < data.users.length; i++) {
    if (tempHandle === data.users[i].handleStr) {
      tempHandle = handle + String(suffix);
      suffix += 1;
    }
  }
  handle = tempHandle;
  return handle;
}

function sameEmail(email: string) {
  const data = getData();

  for (let i = 0; i < data.users.length; i++) {
    if (email === data.users[i].email) {
      return true;
    }
  }
  return false;
}

export {
  authLoginV3,
  authRegisterV3,
  authLogoutV2
};
