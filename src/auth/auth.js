import { getData, setData } from '../dataStore.js';
import validator from 'validator';

/** 
* Allows user to login with email and password that they have registered
* returns a userId if valid and error if invalid
* 
* @param {String} email - User enters a valid email address
* @param {String} password - User enters a password that is >= 6 characters long
* 
* @returns {Object { authUserId: Number}} - Returns a valid authUserId
* @returns {{error: 'error'}} - on error
*/


function authLoginV1(email, password) {
  let data = getData();

  if (!validEmail(email) || !validPass(password)) {
    return { error: 'error' };
  }

  for (let i = 0; i < data.users.length; i++) {
    if (email === data.users[i].email && password === data.users[i].password) {
      return { authUserId: data.users[i].uId };
    }
  }
}
/**
  * Allows user to register with email, password, first name, and last name
  * returns a userId if valid
  * 
  * @param {String} email - User enters a valid email address
  * @param {String} password - User enters a password that is >= 6 characters long
  * @param {String} nameFirst - User enters their first name that is 1 to 50 characters inclusive
  * @param {String} nameLast - User enters their last name that is 1 to 50 characters inclusive
  * 
  * @returns {Object { authUserId: Number}} - Returns a valid authUserId
  * @returns {{error: 'error'}} - on error
*/


function authRegisterV1(email, password, nameFirst, nameLast) {
  let data = getData();

  if (!validEmail(email) || !validPass(password) || !validName(nameFirst) || !validName(nameLast)) {
    return { error: 'error' };
  }

  let handle = getHandleStr(nameFirst, nameLast);
  let handleStr = validHandle(handle);

  if ( isNaN(data.users[0].uId) && data.users.length === 1 ) {
    data.users[0].uId = data.users.length - 1;
    data.users[0].nameFirst = nameFirst;
    data.users[0].nameLast = nameLast;
    data.users[0].email = email;
    data.users[0].password = password;
    data.users[0].handleStr = handleStr;
    data.users[0].isGlobalOwner = true;
  } else {
    data.users.push({
      uId: data.users.length - 1,
      nameFirst: nameFirst,
      nameLast: nameLast,
      email: email,
      password: password,
      handleStr: handleStr,
      isGlobalOwner: false,
    });
  };

  
  setData(data);
  return { authUserId: data.users[data.users.length - 1].uId };
}



// Helper function to generate a valid handle string
function getHandleStr(nameFirst, nameLast) {
  // Given a first and last name
  // return a handle that concats together both names
  // without any uppercase, whitespace, and special characters
  let name1 = nameFirst.toLowerCase().replace(/[0-9]|\W/g, '');
  let name2 = nameLast.toLowerCase().replace(/[0-9]|\W/g, '');

  let result = name1.concat(name2);

  let handleStr = result.substring(0,20);

  return handleStr;
}

// Helper function to get valid email address
function validEmail(email) {
  return validator.isEmail(email);
} 

// Helper function to get valid password
function validPass(password) {
  if (password.match(/.{6,}/)) {
    return true;
  } else {
    return false;
  }
}


// Helper function to get valid first name
function validName(nameFirst) {
  if (nameFirst.length < 1 || nameFirst.length > 50) {
    return false;
  }
  return true;
}

// Helper function to get valid handle string
function validHandle(handle) {
  let data = getData();
  let temp_handle = handle;
  let suffix = 0;
  for (let i = 0; i < data.users.length; i++) {
    if (temp_handle === data.users[i].handleStr) {
      temp_handle = handle + String(suffix);
      suffix += 1;
    }
  }
  handle = temp_handle;
  return handle;
}

export {
  authLoginV1,
  authRegisterV1
}; 
