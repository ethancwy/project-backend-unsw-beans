import { StringifyOptions } from 'querystring';
import { getData, setData } from './dataStore';
import { isValidToken, isValidUser, getUserId, isDmValid, isDmMember } from './global';

function dmCreatev1(token: string, uId: number[]) {
  let data = getData();

  // Is the token valid
  if (isValidToken(token) === false) {
    return { error: 'error' };
  }

  // Are all the uids valid
  for (const uids of uId) {
    if (isValidUser(uids) === false) {
      return { error: 'error' };
    }
  }

  // Are there any duplicate uids
  for (let i = 0; i < uId.length; i++) {
    for (let j = 0; j < uId.length; j++) {
      if (j !== i && uId[j] === uId[i]) {
        return { error: 'error' };
      }
    }
  }

  const ownerId = getUserId(token);

  // Sorting names
  // Pushing owners name
  let ownerName = data.users[ownerId].handleStr;
  let array = [];
  array.push(ownerName);
  // Pushing members names
  for (const uids of uId) {
    array.push(data.users[uids].handleStr);
  }

  // Sorting names in alphabteical order
  let temp;
  for (let i = 1; i < array.length; i++) {
    if (array[i].localeCompare(array[i - 1]) === -1) {
      temp = array[i];
      array[i] = array[i - 1];
      array[i - 1] = temp; 
    }
  }

  // Creating name
  let name = array[0];
  for (let i = 1; i < array.length; i++) {
    name = name + ', ' + array[i];
  }

  // Creating members array
  let members = [];
  members[0] = ownerId;
  let i = 1;
  for (const uids of uId) {
    members[i] = uids;
    i++
  }

  // Creating dm
  data.dm.push({
    dmId: data.dm.length,
    name: name,
    owner: ownerId,
    members: members,
  });

  setData(data);
  return { dmId: data.dm.length - 1 };
}

function dmListv1(token: string)  {
  let data = getData();

  // Checking if token is valid
  if (isValidToken(token) === false) {
    return { error: 'error' };
  }

  const id = getUserId(token);
  const array = [];

  // Storing all relevant dms in array
  for (const dms of data.dm) {
    for (const uids of dms.members) {
      if (uids === id) {
        array.push({
          dmId: dms.dmId,
          name: dms.name,
        })
      }
    }
  }

  return { dms: array };
}

function dmRemovev1(token: string, dmId: number) {

}

function dmDetailsv1(token: string, dmId: number) {
  let data = getData();

  // Checking if token is valid
  if (isValidToken(token) === false) {
    return { error: 'error' };
  }

  // Checking if dmId is valid
  if (isDmValid(dmId) === false) {
    return { error: 'error' };
  }

  // Checking that token user is apart of dm
  const userId = getUserId(token);
  if (isDmMember(userId, dmId) === false) {
    return { error: 'error' };
  }

  // Creating array of users
  const memberArray = [];

  for (const uids of data.dm[dmId].members) {
    memberArray.push({
      uId: data.users[uids].uId,
      email: data.users[uids].email,
      nameFirst: data.users[uids].nameFirst,
      nameLast: data.users[uids].nameLast,
      handleStr: data.users[uids].handleStr,
    });
  }

  return {
    name: data.dm[dmId].name,
    members: memberArray,
  };
}

function dmLeavev1(token: string, dmId: number) {
  let data = getData();

  // Checking if token is valid
  if (isValidToken(token) === false) {
    return { error: 'error' };
  }

  // Checking if dmId is valid
  if (isDmValid(dmId) === false) {
    return { error: 'error' };
  }

  // Checking that token user is apart of dm
  const userId = getUserId(token);
  if (isDmMember(userId, dmId) === false) {
    return { error: 'error' };
  }

  let found = false;
  for (let i = 0; i < data.dm[dmId].members.length - 1, i++) {
    if (data.dm[dmId].members[i] === userId) {
      found = true;
    }   
    if (found === true) {
      data.dm[dmId].members[i] = data.dm[dmId].members[i + 1];   
    }
  }
  data.dm[dmId].members.pop();
  
  setData(data);
  return {};
}