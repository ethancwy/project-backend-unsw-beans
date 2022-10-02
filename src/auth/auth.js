import { getData, setData } from '../dataStore.js';
import validator from 'validator';

function authLoginV1(email, password) {
  return {
    authUserId: 1,
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
  
  const data = getData();

  // Get valid email address
  let finalEmail = validEmail(email);
  // Get valid password
  let pass = validPass(password);
  // Get valid first name
  let firstName = validFirst(nameFirst);
  // Get valid last name
  let lastName = validLast(nameLast);

  let handle = getHandleStr(firstName, lastName);
  let handleStr = validHandle(handle);

  if ( data.users[0].uId === NaN && data.users.length === 0 ) {
    data.users.uId = data.users.length + 1;
    data.users.nameFirst = firstName;
    data.users.nameLast = lastName;
    data.users.email = finalEmail;
    data.users.handleStr = handleStr;
    data.users.isGlobalOwner = true;
  } else {
    data.users.push({
      uId: data.users.length + 1,
      nameFirst: firstName,
      nameLast: lastName,
      email: finalEmail,
      handleStr: handleStr,
      isGlobalOwner: false,
    });
  };
  
  setData(data);
}


export {
  authLoginV1,
  authRegisterV1
}; 
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
  const valid = validator.isEmail(email);

  if (!valid) {
    return console.log({ error: 'error'});
  } else {
    return email;
  }
} 

// Helper function to get valid password
function validPass(password) {
  if (password.match(/.{6,}/)) {
    return password;
  } else {
    return console.log({ error: 'error' });
  }
}

// Helper function to get valid first name
function validFirst(nameFirst) {
  if (nameFirst.match(/.{1,50}/)) {
    return nameFirst;
  } else {
    return console.log({ error: 'error'});
  }
}

// Helpr function to get valid last name
function validLast(nameLast) {
  if (nameLast.match(/.{1,50}/)) {
    return nameLast;
  } else {
    return console.log({ error: 'error'});
  }
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

// testing valid pass
//let pass = validPass('Bob123');
//console.log(pass);


// testing valid first name and last name
let first = validFirst('Peter123');
let last = validLast('Fi1l! @e ');
//console.log(first);
//console.log(last);


let handle = getHandleStr(first, last);
let handleStr = validHandle(handle);
//console.log(handleStr); 

let register = authRegisterV1('p.file@gmail.com', 'bob100', 'Peter123', 'Fi!l! @e ');
console.log(register); 
